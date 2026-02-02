uniform vec3 uBaseColor;
uniform vec3 uHighlightColor;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uTime;
uniform float uOpacity;

varying vec3 vPosition;
varying float vElevation;
varying float vMouseDistance;

void main() {
  // Distance-based highlight from mouse
  float mouseHighlight = smoothstep(uMouseRadius, 0.0, vMouseDistance);

  // Elevation-based coloring - higher points get more highlight
  float elevationFactor = smoothstep(-0.2, 0.4, vElevation);

  // Combine factors
  float highlightStrength = mouseHighlight * 0.7 + elevationFactor * 0.3;

  // Mix base and highlight colors
  vec3 color = mix(uBaseColor, uHighlightColor, highlightStrength * 0.6);

  // Add subtle pulsing on mouse-affected areas
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  color += uHighlightColor * mouseHighlight * pulse * 0.15;

  // Opacity varies with elevation and mouse proximity
  float alpha = uOpacity + mouseHighlight * 0.25 + elevationFactor * 0.1;

  gl_FragColor = vec4(color, alpha);
}
