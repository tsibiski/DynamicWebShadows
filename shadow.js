/* 
+   This file is part of ShadowCast.
+  
+   Author: Tim Sibiski
+  
+   Trilleon is free software: you can redistribute it and/or modify
+   it under the terms of the GNU Lesser General Public License as published by
+   the Free Software Foundation, either version 3 of the License, or
+   (at your option) any later version.
+
+   This program is distributed in the hope that it will be useful,
+   but WITHOUT ANY WARRANTY; without even the implied warranty of
+   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
+   GNU Lesser General Public License for more details.
+
+   You should have received a copy of the GNU Lesser General Public License
+   along with this program.  If not, see <http://www.gnu.org/licenses/>.
+*/


(function () {

	/*
	  These values determine the blur on a shadow. The larger the value, the less visible 
	  and dark a shadow will appear. The smaller the shadow pixel size, the more visible 
	  we will need to make the shadow. Therefore these values are tightly coupled with the 
	  shadow pixel size.
	*/
	var SHORT_SHADOW_PIXEL_DENSITY = 6;
	var MEDIUM_SHADOW_PIXEL_DENSITY = 8;
	var LONG_SHADOW_PIXEL_DENSITY = 10;

	/*
	  These values make the shadow appear to be "longer" or "larger". The higher the value, 
	  the farther from the element the shadows will cast.
	*/
	var SHORT_SHADOW_PIXEL_SIZE = 5;
	var MEDIUM_SHADOW_PIXEL_SIZE = 10;
	var LONG_SHADOW_PIXEL_SIZE = 15;

	/*
	  These values determine how far from the shadowed elements the cursor should be before 
	  the size and density of a shadow changes. The shortest shadow must be a value of 1, 
	  and thus does not need a variable.
	*/
	var MEDIUM_SHADOW_DISTANCE = 250;
	var LONG_SHADOW_DISTANCE = 500;

	document.onmousemove = CursorPositionUpdate;
	function CursorPositionUpdate(event) {

		var eventDoc, doc, body;

		event = event || window.event; // IE-ism

		// If pageX/Y aren't available and clientX/Y are,
		// calculate pageX/Y - logic taken from jQuery.
		// (This is to support old IE)
		if (event.pageX === null && event.clientX !== null) {
			eventDoc = (event.target && event.target.ownerDocument) || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;

			event.pageX = event.clientX +
				(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				(doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY +
				(doc && doc.scrollTop || body && body.scrollTop || 0) -
				(doc && doc.clientTop || body && body.clientTop || 0);

		}

		HandleShadowedElements(event.pageX, event.pageY);

	}


	/*
	 
		*1		*2 		*3


		*4		el		*5


		*6		*7		*8

		In above visualization, consider the asterisk to mark an approximate location of a cursor in relation to the element that should cast shadows.

		*1 = 5px 5px 5px (Defined By: Is cursor left of el_x AND above el_y)
		*2 = 0 5px 5px (Defined By: Is cursor between el_x and el width AND above el_y)
		*3 = -5px 5px 5px  (Defined By: Is cursor right of el_x PLUS el width AND above el_y)
		*4 = 5px 0 5px  (Defined By: Is cursor left of el_x AND between el_y PLUS el height)
		*5 = -5px 0 5px  (Defined By: Is cursor right of el_x PLUS el width AND between el_y PLUS el height)
		*6 = 5px -5px 5px  (Defined By: Is cursor left of el_x AND below el_y PLUS el height)
		*7 = 0 -5px 5px  (Defined By: Is cursor between el_x PLUS el width AND between el_y PLUS el height)
		*8 = -5px -5px 5px  (Defined By: Is cursor between el_x PLUS el width AND below el_y PLUS el height)

	 */

	function HandleShadowedElements(x, y) {

		let els = $(".shadowed");
		for (let i = 0; i < els.length; i++) {

			let el = $(els[i]);
			let width = el.width();
			let height = el.height();
			let el_x = el.offset().left;
			let el_y = el.offset().top;
			let el_x_rightmost_point = el_x + width;
			let el_y_bottommost_point = el_y + height;
			el.removeClass("shadows-region-0-transition")
			.removeClass("shadows-region-1-transition")
			.removeClass("shadows-region-2-transition")
			.removeClass("shadows-region-3-transition")
			.removeClass("shadows-region-4-transition")
			.removeClass("shadows-region-5-transition")
			.removeClass("shadows-region-6-transition")
			.removeClass("shadows-region-7-transition")
			.removeClass("shadows-region-8-transition");

			//Get the closest point on the shadowed element.
			let pointOfReference = { x: 0, y:0 };

			// Region *0 (Directly over top of the element)
			if (x > el_x && x < el_x_rightmost_point && y > el_y && y < el_y_bottommost_point) {

				el.addClass("shadows-region-0-transition");
				pointOfReference = { x: 0, y: 0 }; //Irrelevant; shadown will not be cast.

			}
			// Region *1
			else if (x < el_x && y < el_y) {

				el.addClass("shadows-region-1-transition");
				pointOfReference = { x: el_x, y: el_y }; //Top left point of element.

			}// Region *2
			else if (x > el_x && x < el_x_rightmost_point && y < el_y) {

				el.addClass("shadows-region-2-transition");
				let halfwayX = (el_x_rightmost_point - el_x) / 2 + el_x;
				pointOfReference = { x: halfwayX, y: el_y }; //Center of top side of element.

			}// Region *3
			else if (x > el_x_rightmost_point && y < el_y) {

				el.addClass("shadows-region-3-transition");
				pointOfReference = { x: el_x_rightmost_point, y: el_y }; //Top right point of element.

			}// Region *4
			else if (x < el_x && y > el_y && y < el_y_bottommost_point) {

				el.addClass("shadows-region-4-transition");
				let halfwayY = (el_y_bottommost_point - el_y) / 2 + el_y;
				pointOfReference = { x: el_x, y: halfwayY }; //Center of left side of element.

			}// Region *5
			else if (x > el_x_rightmost_point && y > el_y && y < el_y_bottommost_point) {

				el.addClass("shadows-region-5-transition");
				let halfwayY = (el_y_bottommost_point - el_y) / 2 + el_y;
				pointOfReference = { x: el_x_rightmost_point, y: halfwayY }; //Center of right side of element.

			}// Region *6
			else if (x < el_x && y > el_y_bottommost_point) {

				el.addClass("shadows-region-6-transition");
				pointOfReference = { x: el_x, y: el_y_bottommost_point}; //Bottom left point of element.

			}// Region *7
			else if (x > el_x && x < el_x_rightmost_point && y > el_y_bottommost_point) {

				el.addClass("shadows-region-7-transition");
				let halfwayX = (el_x_rightmost_point - el_x) / 2 + el_x;
				pointOfReference = { x: halfwayX, y: el_y_bottommost_point }; //Center of bottom side of element.

			}// Region *8
			else if (x > el_x_rightmost_point && y > el_y_bottommost_point) {

				el.addClass("shadows-region-8-transition");
				pointOfReference = { x: el_x_rightmost_point, y: el_y_bottommost_point }; //Bottom right point of element.

			}

			//Determine the distance from the center point to the mouse cursor.
			let distance = Math.sqrt(Math.pow(Math.abs(x - pointOfReference.x), 2) + Math.pow(Math.abs(y - pointOfReference.y), 2));
			let shadowPixelSize = 0;
			let shadowBlurPixels = 0;
			if (distance >= LONG_SHADOW_DISTANCE) {

				shadowPixelSize = LONG_SHADOW_PIXEL_SIZE;
				shadowBlurPixels = LONG_SHADOW_PIXEL_DENSITY;

			} else if (distance >= MEDIUM_SHADOW_DISTANCE) {

				shadowPixelSize = MEDIUM_SHADOW_PIXEL_SIZE;
				shadowBlurPixels = MEDIUM_SHADOW_PIXEL_DENSITY;

			} else {

				shadowPixelSize = SHORT_SHADOW_PIXEL_SIZE;
				shadowBlurPixels = SHORT_SHADOW_PIXEL_DENSITY;

			}
			//Set CSS variables to update shadow's size.
			document.documentElement.style.setProperty("--shadow-density", shadowBlurPixels + "px");
			document.documentElement.style.setProperty("--shadow-size-positive", shadowPixelSize + "px");
			document.documentElement.style.setProperty("--shadow-size-negative", -shadowPixelSize + "px");

		}

	}
	
})();
