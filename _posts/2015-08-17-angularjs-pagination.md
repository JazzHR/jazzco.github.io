---
layout: post
title: "Lessons Learned: AngularJS Pagination"
tags: angularjs data lessons pagination patterns
author: Nick Amoscato
---

Once upon a time, I had an idea to create this all-inclusive pagination service that would abstract the common logic used when interacting with a server-side paginated result set via an AngularJS application. A few whiteboarding sessions with a co-worker led to some informal specifications, and shortly thereafter, a well-documented `apiPaginationService` was born.

At a high level, dependent components would register a pagination instance, specifying any number of configuration options. The service would fetch and cache the relevant page of data, internally keeping track of relevant meta information necessary to interact with the paginated result set. A handful of utility methods were exposed, enabling the interaction with a custom [UI Bootstrap](https://angular-ui.github.io/bootstrap/#/pagination)-wrapped directive. Additional methods attempted to minimize the need to re-fetch data from the server when adding, updating or deleting items from an ordered set. And if that was not enough, scrollable lazy loading and multi-instance pagination were both fully supported.

The service was initially ambitious, and it quickly became unwieldy. The 500+ lines of untested code were simply trying to do too much. I used the service in a handful of contexts, but it was clear that it was not a maintainable solution. Drawing from these missteps, I recently approached this problem from an alternative perspective, abstracting the minimum amount of shared logic into an extremely light utility service. This solution is described below.

## Fetch & Store Data

There were a few major complications with the first approach to this problem related to fetching and storing data.

First, a ton of time was spent attempting to minimize the need to re-fetch data from the server. For example, when deleting an item from the last page of a paginated set, the service would simply splice the relevant item from the array. Similarly, adding an item to a paginated set sorted by descending creation date would unshift the item onto the beginning of the array. Looking back on it, this caching “obsession” was entirely unnecessary; the favorable contexts were extremely specific, and the performance benefits were probably unnoticeable. Not to mention, it increased the risk of users interacting with stale data.

Second, the data was stored in the pagination service itself. This proved to be especially problematic when multiple instances of pagination were registered at the same time; the service had to keep track of multiple states, periodically purging irrelevant cached data. In most cases, pagination would exist in separate features entirely, and the need to maintain multiple states was unnecessary.

As you can probably guess, the new utility service does not cache data, nor does it centrally store any data. Instead, it implements a simple method that _returns_ the necessary metadata to interact with the paginated set. This object is stored in a dependent service immediately after data is fetched from the server.

To illustrate what this looks like, let’s assume we have a [state](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider#methods_state) that fetches a paginated set of data before it resolves. The module configuration block would look something like this:

{% highlight javascript %}
$stateProvider.state('app.feature', {
    controller: 'FeatureListCtrl',
    controllerAs: 'featureList',
    resolve: {
        featureListResolve: function($stateParams, featureApiService) {
            return featureApiService.fetchList({
                page: $stateParams.page
            });
        }
    },
    templateUrl: 'feature-list.html',
    url: '/feature?page'
});
{% endhighlight %}

The page of the paginated set is determined by a page state parameter which is passed to a method in the `featureApiService`. Any time the page state parameter changes, the state will reinitialize, and the relevant page of data will be fetched.

> In practice, the resolve dependency will probably interact with a [feature service](/2015/08/10/angularjs-patterns/#feature-services). Regardless, the pagination metadata must be stored in the [API service](/2015/08/10/angularjs-patterns/#api-services), which has access to the full [`$http` response object](https://docs.angularjs.org/api/ng/service/$http#general-usage). A feature service is omitted for simplicity.

For the purposes of this example, assume that the API enables the client to specify `page` and `per_page` query string parameters. The `featureApiService` would then look something like this:

{% highlight javascript %}
function FeatureApiService($http, paginationUtilityService) {
    var self = this;

    var _pagination;

    self.fetchList = fetchList;
    self.getPagination = getPagination;

    function fetchList(queryString) {
        if (angular.isUndefined(queryString)) { queryString = {}; }

        if (!queryString.page) { queryString.page = 1; }

        if (!queryString.per_page) { queryString.per_page = 15; }

        $http.get('/feature', {
            params: queryString
        }).then(function(result) {
             _pagination = paginationUtilityService.store(result, queryString);

             return result.data;
        });
    }

    function getPagination() {
        return _pagination;
    }
}
{% endhighlight %}

where `fetchList` takes a query string object passed to a `/feature` endpoint. The method then resolves with the fetched data after storing the relevant pagination metadata in a private variable, exposed via the public `getPagination` method.

Assuming that the response of the paginated endpoint contains a `x-pagination-total-items` header field that specifies the number of total items in the paginated set, the `paginationUtilityService.store` method would look like this:

{% highlight javascript %}
function store(response, queryString) {
    if (angular.isUndefined(queryString)) { queryString = {}; }

    return {
        page: queryString.page || 1,
        perPage: queryString.per_page || 15,
        totalItems: Number(response.headers()['x-pagination-total-items'])
    };
}
{% endhighlight %}

where `response` is the `$http` response object and `queryString` is the same query string object passed to the paginated endpoint.

## Expose Pagination Interface Control

Now that the relevant data has been fetched, we need to enable the user to interact with the paginated set. There is no sense in re-inventing the wheel; for simplicity, it makes sense to leverage [UI Bootstrap’s `pagination` directive](https://angular-ui.github.io/bootstrap/#/pagination). In an effort to abstract shared logic, I have found it beneficial to wrap this third-party component in a custom directive that interacts with the pagination metadata defined above.

First, the `FeatureListCtrl` must expose the relevant data on scope:

{% highlight javascript %}
function FeatureListCtrl(featureApiService, featureListResolve) {
    var self = this;

    self.featurePagination = featureApiService.getPagination();
    self.features = featureListResolve;
}
{% endhighlight %}

Then, the `featurePagination` metadata object can be passed to the custom directive. The latter component looks something like this:

{% highlight javascript %}
function ApiPaginatorDirective($state) {

    return {
        controller: ApiPaginatorDirectiveCtrl,
        controllerAs: 'apiPaginator',
        replace: true,
        restrict: 'E',
        scope: {
            data: '='
        },
        templateUrl: 'apiPaginator.html',
    };

    function ApiPaginatorDirectiveCtrl($scope) {
        var self = this;

        self.hasSubsequentPage = hasSubsequentPage;
        self.pageChangeHandler = pageChangeHandler;

        function hasSubsequentPage() {
            return $scope.data.totalItems > $scope.data.perPage;
        }

        function pageChangeHandler() {
            return $state.go('.', { page: $scope.data.page });
        }
    }
}
{% endhighlight %}

where `data` is a reference to the pagination metadata object, and the directive’s template is as follows:

{% highlight html %}
<div>
    <pagination 
        items-per-page="data.perPage"
        ng-change="apiPaginator.pageChangeHandler()"
        ng-model="data.page"
        max-size="5"
        next-text="Next"
        ng-if="apiPaginator.hasSubsequentPage()"
        previous-text="Prev"
        total-items="data.totalItems">
    </pagination>
</div>
{% endhighlight %}

> Note that older versions of this UI Bootstrap directive use `page` and `onSelectPage` parameters in place of `ngModel` and `ngChange` respectively.

The pagination control is only visible when there is more than one page, and changing the page simply transitions to the current state with the specified `page` state parameter value.

## Modifying the Paginated Set

Earlier, I mentioned that the previous pagination approach went through leaps and bounds to optimize performance when adding, updating or deleting items in the paginated set. This client-side logic can get extremely complex; thus, I have found it is best to keep this behavior as simple as possible. As a general rule of thumb, simply [reloading](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$state#methods_go) the current state will suffice:

{% highlight javascript %}
$state.go('.', null, { reload: true });
{% endhighlight %}

When an item has a _separate_ state outside the context of the paginated list (i.e. clicking on an item transitions to a view devoted solely to that item), creating or updating an item obviously does not need to affect data that is no longer visible. When the user subsequently views the list, it will be refetched from the server without any complex client-side intervention.

On the other hand, inline editing is certainly more involved given that the paginated set is always visible. Reloading the current state is still a valid option; however, depending on the sort, this could potentially lead to confusing interactions. For example, when sorting by an editable property, modification could move the item onto a different page of the paginated set. This abrupt disappearance could be confusing, and it could be really difficult to figure out which page the item moved to.

The solution largely depends on preference and context, but in the past, I have found it acceptable to simply do nothing after saving an inline edit. In this respect, the item does not move, and any inconsistencies caused by the modification are resolved when the user transitions to another page or revisits the paginated list.

Not surprisingly, deleting an item from the paginated set should also result in reloading the current state. However, there is one edge case worth mentioning that can be addressed: When a user deletes the last item on a page, the paginated set should ideally transition to the previous page if it exists. This logic can easily be abstracted and is illustrated below.

After deleting the specified item, the controller should call a utility method with the pagination metadata. In the context of the `FeatureListCtrl` defined above, this would look something like this:

{% highlight javascript %}
function deleteFeature(featureId) {
    return featureApiService.remove(featureId).then(function() {
        return paginationUtilityService.reloadAfterDeletion(self.featurePagination);
    });
}
{% endhighlight %}

The `paginationUtilityService.reoloadAfterDeletion` method would then be implemented as follows:

{% highlight javascript %}
function reloadAfterDeletion(pagination) {
    var page = pagination.page;

    // If there are no more items on the current page, go to previous page
    if (--pagination.totalItems <= pagination.perPage * (page - 1)) { page--; }

    if (page <= 1) { page = null; }

    return $state.go($state.current, { page: page }, { reload: true });
}
{% endhighlight %}
