//# Hair shader for characters

uniform float iGlobalTime;

void main(void) {
  gl_Position = gl_ModelViewProjectionMatrix * (gl_Vertex + vec4(sin(iGlobalTime + gl_Vertex.y/0.05 + gl_Vertex.x/250.0) * gl_Vertex.y * 0.005, 0, 0, 0));
  gl_FrontColor = gl_Color;
  gl_TexCoord[0] = gl_MultiTexCoord0;
}
