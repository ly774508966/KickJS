Object.defineProperty(window,"defaultMaterial",{
    value: JSON.stringify (
        {"shader":{
            "faceCulling":1029,
            "zTest":513,
            "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nuniform float _time;\n\nvarying vec2 uv;\nvarying vec3 vColor;\n\n#pragma include \"light.glsl\"\n\n// constants\nvec3 materialColor = vec3(1.0,0.7,0.8);\nvec3 specularColor = vec3(1.0,1.0,1.0);\n\nvoid main(void) {\n // compute position\n gl_Position = _mvProj * vec4(vertex, 1.0);\n\n uv = uv1;\n // compute light info\n vec3 n = normalize(_norm * normal);\n vec3 diffuse;\n float specular;\n float glowingSpecular = sin(_time*0.003)*20.0+20.0;\n getDirectionalLight(n, _dLight, glowingSpecular, diffuse, specular);\n vColor = max(diffuse,_ambient.xyz)*materialColor+specular*specularColor+_ambient;\n} ",
            "fragmentShaderSrc":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec3 vColor;\nvarying vec2 uv;\n\nuniform sampler2D tex;\n\nvoid main(void)\n{\n gl_FragColor = texture2D(tex,uv)*vec4(vColor.x, vColor.y, vColor.z, 1.0);\n}\n "},
            "material":{
                "name":"Default material",
                "shader":1,
                "uniforms":{}
            },
            "textureData":[{
                "uid":2,
                "wrapS":10497,
                "wrapT":10497,
                "minFilter":9729,
                "magFilter":9729,
                "generateMipmaps":true,
                "autoScaleImage":true,
                "dataURI":"data:image/png;base64,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",
                "flipY":true,
                "internalFormal":6408}],
            "settingsData":{
                "meshsetting":"sphere",
                "rotatemesh":"on",
                "lightpos":[1,1,1],
                "lightrot":[0,0,0],
                "lightcolor":[1,1,1],
                "lightAmbient":[0.1,0.1,0.1],
                "lightintensity":1},
            "about":"",
            "name":"Default shader"
        }
    )
});
