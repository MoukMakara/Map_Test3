import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { GoogleMapsContext, latLngEquals } from "@vis.gl/react-google-maps";

const CircleEventProps = {
  onClick: () => {},
  onDrag: () => {},
  onDragStart: () => {},
  onDragEnd: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
  onRadiusChanged: () => {},
  onCenterChanged: () => {},
};

// const CircleProps = { ...google.maps.CircleOptions, ...CircleEventProps };

// const CircleRef = React.Ref(google.maps.Circle | null);

function useCircle(props) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
    radius,
    center,
    ...circleOptions
  } = props;

  const callbacks = useRef({});

  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
  });

  const circle = useRef(new google.maps.Circle()).current;

  circle.setOptions(circleOptions);

  useEffect(() => {
    if (!center) return;
    if (!latLngEquals(center, circle.getCenter())) circle.setCenter(center);
  }, [center]);

  useEffect(() => {
    if (radius === undefined || radius === null) return;
    if (radius !== circle.getRadius()) circle.setRadius(radius);
  }, [radius]);

  const map = useContext(GoogleMapsContext)?.map;

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("<Circle> has to be inside a Map component.");

      return;
    }

    circle.setMap(map);

    return () => {
      circle.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!circle) return;

    const gme = google.maps.event;

    [
      ["click", "onClick"],
      ["drag", "onDrag"],
      ["dragstart", "onDragStart"],
      ["dragend", "onDragEnd"],
      ["mouseover", "onMouseOver"],
      ["mouseout", "onMouseOut"],
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(circle, eventName, (e) => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });
    gme.addListener(circle, "radius_changed", () => {
      const newRadius = circle.getRadius();
      callbacks.current.onRadiusChanged?.(newRadius);
    });
    gme.addListener(circle, "center_changed", () => {
      const newCenter = circle.getCenter();
      callbacks.current.onCenterChanged?.(newCenter);
    });

    return () => {
      gme.clearInstanceListeners(circle);
    };
  }, [circle]);

  return circle;
}

/**
 * Component to render a Google Maps Circle on a map
 */
const Circle = forwardRef((props, ref) => {
  const circle = useCircle(props);

  useImperativeHandle(ref, () => circle);

  return null;
});