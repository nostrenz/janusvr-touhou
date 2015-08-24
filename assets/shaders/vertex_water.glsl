//# Original from http://www.dgp.toronto.edu/~mccrae/projects/firebox/home/water_vertex.txt

//#version 110

uniform mat4 iModelMatrix;
uniform mat4 iNormalMatrix;  //Note: this is transpose(inverse(iModelMatrix)) 
uniform mat4 iViewMatrix;
uniform mat4 iViewMatrixInverse;
uniform float iGlobalTime;
uniform int iUseTexture0;
uniform int iUseTexture1;
uniform int iUseTexture2;
uniform int iUseTexture3;
uniform sampler2D iTexture0;
uniform sampler2D iTexture1;
uniform sampler2D iTexture2;
uniform sampler2D iTexture3;
uniform int iUseClipPlane;
uniform int iUseLighting;
uniform int iIllum;
uniform vec4 iClipPlane;                                       

varying vec3 iPosition;
varying vec3 iPositionWorld;
varying vec3 iPositionCamera;
varying vec3 iNormal;
varying vec3 iNormalWorld;
varying vec3 iNormalCamera;

#define INTENSITY 0.10

void main(void)
{
  iPosition = gl_Vertex.xyz;
  iNormal = gl_Normal;
  iPositionWorld = (iModelMatrix * gl_Vertex).xyz;  
  iPositionCamera = (gl_ModelViewMatrix * gl_Vertex).xyz;   
  iNormalWorld = (iNormalMatrix * vec4(gl_Normal, 0.0)).xyz;  
  iNormalCamera = gl_NormalMatrix * gl_Normal;
  
  // Calculate vector
  gl_Vertex.y += sin(iGlobalTime + gl_Vertex.x*0.55) * INTENSITY;
  gl_Vertex.y += sin(iGlobalTime + gl_Vertex.z*0.55) * INTENSITY;
  
  // Set position and color
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
  gl_FrontColor = gl_Color;
  
  gl_TexCoord[0] = gl_MultiTexCoord0;
  gl_TexCoord[1] = gl_MultiTexCoord1;
  gl_TexCoord[2] = gl_MultiTexCoord2;
  gl_TexCoord[3] = gl_MultiTexCoord3;
}
