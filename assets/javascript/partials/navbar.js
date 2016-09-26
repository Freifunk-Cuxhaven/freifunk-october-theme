$( document ).ready( function() {
    $( "#sidebar" ).simplerSidebar( {
        align: "left",
        selectors: {
            trigger: ".toggle-sidebar",
            quitter: "close-sidebar"
        }
    } );
} );