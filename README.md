A pretty simple tool I whipped up in an afternoon to help me navigate large XML files. Would love to see this as a VSCode extension.

## Expand All & Hide All
 - Toggles the "hide" class for all elements with the class .xml. Actually painfully slow.

## Commands 
 - This stores inputs submitted from Expanded Targets. Clicking on this will only change the value inside Expanded Targets and will require a resubmission

## Pins
 - While a node is focused, a "Pin" button will be available. Clicking on that button will add that node into the Pins container and clicking on the element inside said container will scroll the window to bring that node into view.

## Expanded Targets
 - This is a basic querySelectorAll. So for example typing ".xml" will target all elements with the xml class and expand them (removing the "hide" class).
 - "nn" is a shorthand for the "node-name" attribute, and "nv" for the "node-value" attribute.
