---
layout: post
title: Building XPath selectors for Behat
tags: behat php
---

We were a small team when we started using Behat for integration testing. At first, we used CSS selectors to interact with the DOM. This worked, until the app evolved from jQuery to Angular. We no longer had convenient IDs and classes to latch onto.

We adopted XPath, mostly because it enabled us to select elements based on text. The problem is, most web developers are familiar with CSS selectors, but they've never tried XPath. Since the automation team was small (about 1.1 people), I focused on simplicity. I wanted Behat to be approachable, so developers had less hurdles when they wrote their own tests.

Here's an example of how we might interact with a modal:

    $ModalTitle = DomBy(
        "tag"       , "div"              ,
        "has class" , "modal-title"      ,
        "has text"  , "Change Status"    )

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

The DomBy functions convert the list of arguments into an XPath.

This is how we might assert the contents of a table:

    $ExpectedValues = array(
        array("Dave Allen"    , "Software Engineer" ),
        array("Gabe Miller"   , "Software Engineer" ),
        array("Cory Trimm"    , "Automation Intern" ),
        array("Nathan Donato" , "Technical Writer"  ),
        );

    $ExpectedRowCount = sizeof($ExpectedValues);

    $Trs
        ->DomBy(
        "id" , "employee-table" )

        ->DomsBy(
        "tag" , "tr" );

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
