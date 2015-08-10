---
layout: post
title: AngularJS Patterns
tags: angularjs patterns data loading service architecture controller
author: Nick Amoscato
---

As a part of our Q3 [OKRs](https://en.wikipedia.org/wiki/OKR) at Jazz, we are trying to establish a cadence in which we give an informal presentation on some informative topic across the engineering team. Pretty cool concept, and I was thrilled to talk through some patterns I derived over the past year or so, since I have been exposed to [AngularJS](https://angularjs.org/). I summarized what I talked about below.

## Data Loading

There are essentially two paradigms when it comes to loading data in a single page app, determined by whether or not that data is loaded _before_ or _after_ controller initialization.

The minimum amount of data needed to render a view can be loaded **before controller initialization** by defining a [resolve map](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) on the relevant state ([UI Router](http://angular-ui.github.io/ui-router/site/#/api/ui.router) concept) configuration object. In the module configuration block, this looks something like this:

{% highlight javascript %}
$stateProvider.state('app.feature', {
    controller: 'FeatureCtrl',
    controllerAs: 'feature',
    resolve: {
        featureData: function(featureService) {
            return featureService.fetch();
        }
    },
    templateUrl: 'feature-template.html',
    url: '/feature'
});
{% endhighlight %}

where `featureData` is a specified resolve dependency, returning a [promise](https://docs.angularjs.org/api/ng/service/$q) that resolves with the fetched data. `FeatureCtrl` would then look something like this:

{% highlight javascript %}
angular
    .module('app.feature')
    .controller('FeatureCtrl', FeatureCtrl);
 
function FeatureCtrl(featureData) {
    var self = this;
 
    self.data = featureData;
}
{% endhighlight %}

where `featureData` is a reference to the data resolved from the promise defined above.

The rest of your data should be loaded immediately **after controller initialization**. This deferred approach is usually coupled with some sort of visual indication that data is being loaded; otherwise, your interface will probably look broken. The feature service fetch methods are called directly in the controller (as opposed to a resolve dependency), and the visual loading indication is replaced with the data, exposed on scope, after it has been fetched.

I could honestly get behind the idea that argues _all_ data loading in a single page app should be deferred. Although you have to spend a little extra time implementing a loading state, this is one of the easiest and most effective ways to improve _perceived_ performance – a huge win for your UX. With that said, I thought it was useful to highlight the concept of resolve dependencies as well.

## Service Architecture

Almost all of the tutorials you read about AngularJS define the code for their examples in a controller for simplicity. This is unfortunate and directly relates to the primary drawback when trying to learn AngularJS – nobody talks about _where_ to write your code.

As I just implied, you shouldn’t be writing all of your code in controllers. Instead, it should be appropriately written across [service](https://docs.angularjs.org/guide/providers) layers. (Note that when I say “service”, I am referring to a set of related recipe types created by the [injector service](https://docs.angularjs.org/api/auto/service/$injector). The names of these AngularJS concepts severely overcomplicate things, and clarification is unfortunately outside the scope of this post.) So now the question becomes: How do you define these service layers?

Well, it depends on the context. And even in a given context, there is not a right or wrong answer. In general, there are two primary reasons for introducing a level of service abstraction: reusability and testability. Services that exist at higher levels of abstraction should be more generic, and their usage should be broad. Creating these levels inherently simplifies code; it is much easier to write unit tests for these smaller methods.

For the purposes of this post, there are two abstract service levels that I have conceptualized – _API_ and _feature_ services. Each of these levels can (and should, for complex features) contain more than one level, but as I mentioned before, that sort of breakdown depends on the context and is not easily generalized into some pattern.

**API services** define flexible wrapper methods around API endpoints that can be used across many features in your application. The main goal is to centralize the touchpoints to your API such that when an endpoint definition changes, that only affects one place in your front end code. Note that these services are analogous to [resources](https://docs.angularjs.org/api/ngResource/service/$resource) or other [similar solutions](https://github.com/mgonto/restangular) – none of which I have used extensively.

Most of these API services simply hit up an API endpoint and return the relevant promise. These methods can certainly accept a query string object parameter to enable flexible requests; however, they should not contain any excessive business logic (i.e. this is probably not the place to trigger a confirmation dialog). When unsure, just keep asking yourself: What will enable me to use this method in any context across my application?

I have found it useful to define a `save` method in API services that abstracts conditional create and update logic. The method usually looks something like this:

{% highlight javascript %}
function save(feature) {
    var method = angular.isDefined(feature.id) ? 'PUT' : 'POST';
 
    return apiService.call(feature, {
        method: method,
        path: 'feature'
    }).then(function(result) {
        return angular.extend(feature, result.data);
    });
}
{% endhighlight %}

**Feature services** define reusable logic that can be used across multiple feature controllers. They actually don’t _have_ to be used across multiple controllers, but that’s the idea to keep in mind. The main goal is to eliminate excessive controller logic such that controllers are only concerned about the purposes defined in the last section of this post.

The most obvious example involves the scenario in which a feature exposes the same functionality in multiple different places. For example, assume that the same modal is used to _create_ and _edit_ an entity. The method that opens this modal should be defined in a feature service. A reference to this method would then be exposed on scope in two different places, but the underlying logic is defined once.

In many cases, the interface for a specific feature is going to enable the user to interact with a _subset_ of the defined API parameters. For example, while the API may enable the client to filter a list of entities on some property, a feature might statically define one filter, only enabling the user to specify the page in the pagination result set. In this case, a feature service method can wrap an API service method, simplifying the interface at lower levels of abstraction.

## Controller Patterns

Controllers have two purposes: _template glue_ and _interface state_. Note that there is nothing here about crazy business logic; that should have already been abstracted in your service architecture.

**Template glue** encompasses exposing service methods and initializing simple models.

Assuming that your business logic is sufficiently contained in feature services, exposing a reference to this method should literally be one line of code in your controller – a _thin_ line of glue between your services and templates if you will. Recently, I have been using the controller as a layer of abstraction to the template. Specifically, the controller defines _small_ methods with a subset of the parameters accepted by feature services. This minimizes the code in templates and increases testability.

Many of the parameters passed to these methods are the model of a [form](https://docs.angularjs.org/guide/forms). It seems obvious, but don’t make more work for yourself, and let the _template_ directly [map](https://docs.angularjs.org/api/ng/directive/ngModel) to the JSON property names defined by the API. In the context of interacting with one entity, I have informally established the convention of exposing a `model` object on scope.

Controllers are also responsible for maintaining **interface state**, such as keeping track of whether or not a feature is in edit mode.

In practice, I have found it helpful to namespace boolean state variables in a `state` object exposed on scope. Otherwise, you end up with a bunch of state variables cluttering up your scope. Additionally, I tend to take advantage of the “falsy value of undefined”. Specifically, I tend to write conditional logic in such a way that the default state is false which eliminates the need to explicitly initialize state variables at controller initialization. (Note that JavaScript equality is [pretty crazy](https://dorey.github.io/JavaScript-Equality-Table/); that last statement should be taken with a grain of salt.)

I have found the edit example I mentioned above to be quite common and derived a pattern specifically for that. This applies to _editing_, _canceling_ or _saving_ an entity. In order to make this work, you have to maintain two models. The _pristine model_ reflects what is in the database, is bound to readable interface elements and is updated after a successful save. The _dirty model_ is only relevant when in an edit state and is effectively a cloned pristine model bound to form inputs.

The [workflow](http://cl.ly/0A3P1F2P0e1I) then looks something like this:

1. Bind the pristine model fetched from the API to readable interface elements.

2. When transitioning into “edit mode”, clone the pristine model and bind that new object to your edit form inputs.

3. If you _cancel_ edit mode, you don’t have to do anything because the pristine model was not changed. In this case, the dirty model is no longer relevant and can be destroyed.

4. If you _save_ the dirty model, you should merge the dirty model back into the pristine model and toggle the edit mode.

There are a couple of points worth highlighting. First, it is only necessary to create a dirty model when transitioning into edit mode. If the user never chooses to enter edit mode, there is no sense in keeping around a JavaScript object that will not be used. Second, it is important to re-clone the pristine model every time the user transitions into edit model; otherwise, you end up with references to old dirty models, which is not good.
