// Original borrowed by Marisa from http://www.gathervr.com/Dizzyhomeroom/watershaderT.txt
// and edited by me.

uniform vec3      iResolution;
uniform float     iGlobalTime;
uniform float     iChannelTime[4];
uniform vec4      iMouse;
uniform vec4      iDate;
uniform float     iSampleRate;
uniform vec3      iChannelResolution[4];
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

#define TAU 6.28318530718
#define MAX_ITER 10
#define OPACITY 0.45

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
	float time = iGlobalTime * .5+10.0;
	
	vec2 uv = gl_TexCoord[0].st;
	vec2 p = mod(uv*TAU*15.0, TAU)-250.0;
	vec2 i = vec2(p);
	
	float c = 1.0;
	float inten = .005;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time * (1.0 - (1.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);
	vec3 colour = vec3(pow(abs(c), 50.0));
	
	// Add the blue part
    colour = clamp(colour + vec3(0.0, 0.30, 0.45), 0.0, 1.0);
    
	fragColor = vec4(colour, 1.0);
}

void main(void)
{
	vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
	
	mainImage(color, gl_TexCoord[0].st);
	
	color.a = OPACITY;
	
	gl_FragColor = color;
}
