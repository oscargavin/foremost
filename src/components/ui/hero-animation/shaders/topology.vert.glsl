uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uNoiseScale;
uniform float uWaveAmplitude;

varying vec3 vPosition;
varying float vElevation;
varying float vMouseDistance;

void main() {
  vec3 pos = position;

  // Store original XZ for fragment shader
  vPosition = pos;

  // Ambient undulating waves - multiple frequencies for organic feel
  float wave1 = sin(pos.x * 0.5 + uTime * 0.3) * 0.12;
  float wave2 = cos(pos.z * 0.4 + uTime * 0.25) * 0.10;
  float wave3 = sin((pos.x + pos.z) * 0.3 + uTime * 0.2) * 0.08;

  pos.y += (wave1 + wave2 + wave3) * uWaveAmplitude;

  // Mouse ripple effect
  float dist = distance(pos.xz, uMouse);
  vMouseDistance = dist;

  // Ripple: outward-traveling wave that decays with distance
  float ripplePhase = dist * 2.5 - uTime * 3.5;
  float rippleDecay = exp(-dist * 0.4) * smoothstep(uMouseRadius, 0.0, dist);
  float ripple = sin(ripplePhase) * rippleDecay * 0.35;

  pos.y += ripple;

  // Store final elevation for fragment shader
  vElevation = pos.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
