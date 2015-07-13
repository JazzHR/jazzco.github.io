---
layout: post
title: Building XPath selectors for Behat
tags: behat php
author: Dave Allen
---

When we first started using Behat for integration testing we used CSS selectors to interact with the DOM. This worked well until we migrated from jQuery to Angular in our application. We stopped placing IDs on most elements because we no longer were using jQuery to target elements in our clientside Javascript. As a side effect this also meant that we no longer could reliably use CSS selectors to target elements in testing.

We began using XPath selectors because it enabled us to target elements based on the text that they contain. One problem that we ran into is that while most web developers are familiar with CSS selectors they are not familiar with XPath. I built a class for building XPath selectors in Behat with a focus on simplicity. I needed to keep it simple because I wanted our automated tests to be approachable so that developers had fewer hurdles when they wrote their own tests.

Here's an example of how we might interact with a modal:

{% highlight php %}
<?php

    $ModalTitle = DomBy(
        "tag"       , "div"              ,
        "has class" , "modal-title"      ,
        "has text"  , "Change Status"    );

    $Modal = $ModalTitle
        ->Ancestor("div");

    $Modal
        ->DomBy(
        "tag" , "select" )
        ->SetValue("Hired");

    $Modal
        ->DomBy(
        "tag"  , "input"    ,
        "type" , "checkbox" )
        ->SetValue("Check");

    $Modal
        ->DomBy(
        "tag"     , "button" ,
        "is text" , "Save"   )
        ->Click();

{% endhighlight %}

The DomBy function uses its list of arguments to create an XPath selector. If an element is found it returns an object that represents the matching element.

Here's an example of how we can assert the contents of a table:

{% highlight php %}
<?php

    $ExpectedValues = array(
        array("Dave Allen"    , "Software Engineer"   ),
        array("Gabe Miller"   , "Software Engineer"   ),
        array("Cory Trimm"    , "Automation Engineer" ),
        array("Nathan Donato" , "Automation Engineer" ),
        );

    $ExpectedRowCount = sizeof($ExpectedValues);

    $Trs = DomBy(
        "id" , "employee-table" )
        ->DomsBy(
        "tag" , "tr"            );

    AssertEqual(
        $ExpectedRowCount,
        sizeof($Trs),
        "The table did not have as many rows as expected.");

    for($i = 0; $i < $ExpectedRowCount; $i++){

        $Tds = $Trs[$i]->DomsBy(
            "tag" , "td" );

        AssertEqual(
            $ExpectedValues[$i][0],
            $Tds[0]->Text(),
            "Name column in row $i did not match expectations.");

        AssertEqual(
            $ExpectedValues[$i][1],
            $Tds[1]->Text(),
            "Job title column in row $i did not match expectations.");

    }
{% endhighlight %}
