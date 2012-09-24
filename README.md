jquery.floatThead
=================

Float the table header without losing your events or styles.  

[DEMO](http://programmingdrunk.com/floatThead/)



Why do we need another plugin that does this?
---------------------

All other floating header plugins work by cloning the existing header, hiding it and then using it to help calculate the cloned header's column sizes.  
This approach has the following disadvantages:  

*   Events must be cloned. Any code that has a reference to the old (now hidden) head will break.
*   Because the cloned header no longer exists inside the original table, styles may break.

jquery.floatThead does not clone your header, so events bound to it still work. Any libraries that hold a reference to the header (such as datatables or tablesorter) work without any issues.


