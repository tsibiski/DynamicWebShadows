# DynamicWebShadows
Cast shadows on your html elements from the mouse cursor, as if it were a source of light. The shadows react to the movement of a cursor. The farther away the cursor is from the elment, the "longer" the shadows are.

Simply add the class, "shadowed" to any html element. Make sure to attach shadow.css and shadow.js to a page's resources. The rest will be automatic. Any element with the "shadowed" class will have box shadows cast from them as if a light source is coming from a user's mouse cursor.

If you'd like an element to cast the light instead of the mouse, remove "CursorPositionUpdate()" as the "source"/position casting the light, and replace it with your element's calculated position (center point of element) instead.

See it in action here: https://codepen.io/tsibiski/full/mdbmweQ
