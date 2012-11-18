requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        kick: '../../../../src/js/kick'
    }
});

requirejs(['kick/all'],
    function (KICK) {
        "use strict";

        var engine;
        var meshRenderer;
        var texture;

        function setMaterial(vertexShaderId, fragmentShaderId){
            var vs = document.getElementById(vertexShaderId).value;
            var fs = document.getElementById(fragmentShaderId).value;
            var shader = new KICK.material.Shader(engine);
            shader.vertexShaderSrc = vs;
            shader.fragmentShaderSrc = fs;
            shader.errorLog = console.log;
            shader.apply();
            var missingAttributes = meshRenderer.mesh.verify(shader);
            if (missingAttributes){
                log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
                return;
            }

            meshRenderer.material = new KICK.material.Material(engine,{
                name:"Some material",
                shader:shader,
                uniformData:{
                    skybox:texture
                }
            });
        }

        function recalculateNormals(){
            var mesh = meshRenderer.mesh;
            mesh.recalculateNormals();
            mesh.updateData();
        }

        function recalculateTangents(){
            var mesh = meshRenderer.mesh;
            mesh.recalculateTangents();
            mesh.updateData();
        }


        function addRotatorComponent(gameObject){
            var time = engine.time,
                transform = gameObject.transform,
                rotationSpeed = 0.001,
                translation = transform.localPosition,
                rotVec = transform.localRotationEuler,
                radius = 5,
                radianToDegree = KICK.core.Constants._RADIAN_TO_DEGREE,
                res = document.getElementById("res");
            gameObject.addComponent({
                update: function(){
                    var timeTotal = time.time,
                        rot = timeTotal*rotationSpeed;
                    translation[0] = Math.sin(rot)*radius;
                    translation[1] = Math.sin(rot*3);
                    translation[2] = Math.cos(rot)*radius;
                    rotVec[1] = rot*radianToDegree;
                    transform.localPosition = translation;

                    //new Date().getMilliseconds();
                    transform.localRotationEuler = rotVec;
                    res.innerHTML = KICK.math.Mat4.strPretty(transform.getGlobalMatrix())+"\nRotation euler:"+KICK.math.Vec3.str(rotVec);
                }
            });
        }

        function initKick() {
            engine = new KICK.core.Engine('canvas',{
                enableDebugContext: true
            });
            var cameraObject = engine.activeScene.createGameObject();
            var camera = new KICK.scene.Camera({
                clearColor: [0,0,0,1],
                fieldOfView:60
            });
            texture = new KICK.texture.Texture(engine,{
                textureType:KICK.core.Constants.GL_TEXTURE_CUBE_MAP
            });
            var image = new Image();

            var textureSrc = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/4QhsRXhpZgAASUkqAAgAAAAOAAABAwABAAAAAGAAAAEBAwABAAAAABAAAAIBAwAEAAAAtgAAAAMBAwABAAAAAQAAAAYBAwABAAAAAgAAABIBAwABAAAAAQAAABUBAwABAAAABAAAABoBBQABAAAAvgAAABsBBQABAAAAxgAAABwBAwABAAAAAQAAACgBAwABAAAAAgAAADEBAgAcAAAAzgAAADIBAgAUAAAA6gAAAGmHBAABAAAAAAEAACwBAAAIAAgACAAIAID8CgAQJwAAgPwKABAnAABBZG9iZSBQaG90b3Nob3AgQ1MzIFdpbmRvd3MAMjAwODoxMDoyOCAxMDo1ODoyNgAAAAMAAaADAAEAAAD//wAAAqAEAAEAAAAgAwAAA6AEAAEAAACFAAAAAAAAAAAABgADAQMAAQAAAAYAAAAaAQUAAQAAAHoBAAAbAQUAAQAAAIIBAAAoAQMAAQAAAAIAAAABAgQAAQAAAIoBAAACAgQAAQAAANoGAAAAAAAASAAAAAEAAABIAAAAAQAAAP/Y/+AAEEpGSUYAAQIAAEgASAAA/+0ADEFkb2JlX0NNAAL/7gAOQWRvYmUAZIAAAAAB/9sAhAAMCAgICQgMCQkMEQsKCxEVDwwMDxUYExMVExMYEQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAQ0LCw0ODRAODhAUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAbAKADASIAAhEBAxEB/90ABAAK/8QBPwAAAQUBAQEBAQEAAAAAAAAAAwABAgQFBgcICQoLAQABBQEBAQEBAQAAAAAAAAABAAIDBAUGBwgJCgsQAAEEAQMCBAIFBwYIBQMMMwEAAhEDBCESMQVBUWETInGBMgYUkaGxQiMkFVLBYjM0coLRQwclklPw4fFjczUWorKDJkSTVGRFwqN0NhfSVeJl8rOEw9N14/NGJ5SkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2N0dXZ3eHl6e3x9fn9xEAAgIBAgQEAwQFBgcHBgU1AQACEQMhMRIEQVFhcSITBTKBkRShsUIjwVLR8DMkYuFygpJDUxVjczTxJQYWorKDByY1wtJEk1SjF2RFVTZ0ZeLys4TD03Xj80aUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9ic3R1dnd4eXp7fH/9oADAMBAAIRAxEAPwDQoyaRZs3h09jymyrQHHv8CspuX1Q6WY+8eb6pHz3qTsjJP/aWR4F9f/kk8SCwgp37nc6AoNjnV2ez3NgH5qDrMk/Roc0+VjD/AOjEMPzAIOMXkmdzrGD/AKLbE/3InQ7eCwQlu36spjoBkeIOqv4hGjjxP0lkNuEt34Ng/fLb64+TXO/78iMzshktbhu9LXaDayfL6Lk240av6r6N6h1s682VCjSC4OMa/RmNf7SzX2lr9rQQAY17qtjvy3ZLzZW5lRY6CXtdB0ge129HsYTXBknQgjlGGy2W6VpEwe6jZXubHmq7H2bwHNiDpKvNaXHhH5TaiLFNNJJJQsqlsdH6sMTGOM7aC57nsLgSNY3MdH70LHVe9+c22MesvqIEne1uv52j3NckEF7jG63063E25T2VXSd9ZEcfn7of7lk3ZFeReY1YwkjaIafl9JcxdTc4NNNNtb/8IHW1uafDZ7mvZ/nolN3VKmbGVkDt76yf+rR0RRdTKsZdLN0AEQD/ABUWMcBrx2PZZltnU7GbDWS0mSA6sCR/bQ9vUNu30jHh6jP/ACaeJ1GlphZt1zY1rZcRoqt9xOtes9wqYryC8G3Hc9g/MbZW2fj7lYdfftivB2fCyr+9ASAPWkmJf//QNiYl2ZkNxqI9R4cRumPaDY76DXu+i381iMzpHUXv2tqkbS4PB9hhnr7GP/P3t9tb/wCZ9T/CoWF/P/4X6Fn8x9P6Dv8AwP8A03/BLXt9X7Jd/T9m4zu9P1J9P/Cf4b7N/U/RbElOLfj347msvYa3uY2wNJE7XfR3bT7HfyHe9DVrqU/aGz6/0P8AtVHqfTt4j/Bf+jPVVVJTZq6dm32tqprNjnNpeS3VrG5Eegbnfmc+5Cvosos9OwAOgOBBBBa4b636fvs93u961at/2fH/AOUY2Y8bNuyN/wDgf5P/AJX7/wDz2svI/wAD/OfzFUer/V/wX/db/uN/wSSmeBWLcjaezHH7oWpR0/1nFgLWkNLvdMQ0bnRta/3bVR6LH27WP5t/0pj83wW/ibPXP0PoP43R9E/9D9/+QnxulkqtyLek5NQdbZS5rWmC4xpMf+SSZW1sFbfUp9Cz+d27/wA6Nk/ov5z8/b+5+Z6v8tYvjM89/wDYibRo5+LhZGVXdZSARjND7ASZIIe4Ctoa7e79E9TPSupBpccdwgxEt3EzXX7Wbt7/AH31N9in02fSyv6VGxu77LxEW/0j87b+56f+D+0q7Zu9V0/tP6Wu6N3OJ/0/6n+E+wqNkc2zp+fVU66zHsZUz6VhA2jXb4/R3fnKutTL3elfP276Bn1o2/Sf/O/8EstJTaPS86Kiyo2i1jLG7J0bYDZXvNgrbu2Ne/2b2M2fTUbOn51VLr7aH11NDSXPhujzsZDXHf8ASP0UfEn7QyPtc7qY9GN/9Ftjb/7rf+az11PJn7Jb/TYhn89Hpx+qfz353/F/+gf/AAiSnNR8TCvy/W9Hb+gr9V+4x7Rp7dHe5AV3pkzkf0mPS1+yRMT/AIb/AIP+p70lI2dMz3lw9BzHBhsAfoXABtm2v992yxj/ANxn+E2KsCCJGoK6A7vtP/evyZnb6n0W7Y/9HfyPS9Rc8OBx8uElP//Z/+0OblBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAHHAIAAAIAAAA4QklNBCUAAAAAABDo8VzzL8EYoaJ7Z63FZNW6OEJJTQPtAAAAAAAQAEgAAAABAAIASAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTQQKAAAAAAABAAA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgAGOEJJTQQCAAAAAAAOAAAAAAAAAAAAAAAAAAA4QklNBDAAAAAAAAcBAQEBAQEBADhCSU0ELQAAAAAABgABAAAADzhCSU0ECAAAAAAAEAAAAAEAAAJAAAACQAAA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eG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4YXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB0aWZmOkltYWdlV2lkdGg9IjI0NTc2IiB0aWZmOkltYWdlTGVuZ3RoPSI0MDk2IiB0aWZmOkNvbXByZXNzaW9uPSIxIiB0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb249IjIiIHRpZmY6U2FtcGxlc1BlclBpeGVsPSI0IiB0aWZmOlBsYW5hckNvbmZpZ3VyYXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOk5hdGl2ZURpZ2VzdD0iMjU2LDI1NywyNTgsMjU5LDI2MiwyNzQsMjc3LDI4NCw1MzAsNTMxLDI4MiwyODMsMjk2LDMwMSwzMTgsMzE5LDUyOSw1MzIsMzA2LDI3MCwyNzEsMjcyLDMwNSwzMTUsMzM0MzI7MUYxQThGNjJBNTI2NDI3QzU2RUM5N0I5RDVFODQxOTgiIHhhcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTMyBXaW5kb3dzIiB4YXA6Q3JlYXRlRGF0ZT0iMjAwOC0xMC0yOFQxMDo1ODoyNiswMTowMCIgeGFwOk1vZGlmeURhdGU9IjIwMDgtMTAtMjhUMTA6NTg6MjYrMDE6MDAiIHhhcDpNZXRhZGF0YURhdGU9IjIwMDgtMTAtMjhUMTA6NTg6MjYrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOkhpc3Rvcnk9IiIgeGFwTU06SW5zdGFuY2VJRD0idXVpZDowRUJBNUNCRUQ2QTRERDExQTQ1M0NFNDg4Q0MyOENFQSIgeGFwTU06RG9jdW1lbnRJRD0idXVpZDowREJBNUNCRUQ2QTRERDExQTQ1M0NFNDg4Q0MyOENFQSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjgwMCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjEzMyIgZXhpZjpDb2xvclNwYWNlPSItMSIgZXhpZjpOYXRpdmVEaWdlc3Q9IjM2ODY0LDQwOTYwLDQwOTYxLDM3MTIxLDM3MTIyLDQwOTYyLDQwOTYzLDM3NTEwLDQwOTY0LDM2ODY3LDM2ODY4LDMzNDM0LDMzNDM3LDM0ODUwLDM0ODUyLDM0ODU1LDM0ODU2LDM3Mzc3LDM3Mzc4LDM3Mzc5LDM3MzgwLDM3MzgxLDM3MzgyLDM3MzgzLDM3Mzg0LDM3Mzg1LDM3Mzg2LDM3Mzk2LDQxNDgzLDQxNDg0LDQxNDg2LDQxNDg3LDQxNDg4LDQxNDkyLDQxNDkzLDQxNDk1LDQxNzI4LDQxNzI5LDQxNzMwLDQxOTg1LDQxOTg2LDQxOTg3LDQxOTg4LDQxOTg5LDQxOTkwLDQxOTkxLDQxOTkyLDQxOTkzLDQxOTk0LDQxOTk1LDQxOTk2LDQyMDE2LDAsMiw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwyMCwyMiwyMywyNCwyNSwyNiwyNywyOCwzMDs2RTI0NzZFRjdGQ0M1OUQxMzI2MDcwQ0VCQjg3NzEwQyI+IDx0aWZmOkJpdHNQZXJTYW1wbGU+IDxyZGY6U2VxPiA8cmRmOmxpPjg8L3JkZjpsaT4gPHJkZjpsaT44PC9yZGY6bGk+IDxyZGY6bGk+ODwvcmRmOmxpPiA8cmRmOmxpPjg8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L3RpZmY6Qml0c1BlclNhbXBsZT4gPHhhcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InV1aWQ6MEEyOEQ5MjA5QkEzREQxMTlBQ0E4NEIxM0QzMUIyNTkiIHN0UmVmOmRvY3VtZW50SUQ9InV1aWQ6MDkyOEQ5MjA5QkEzREQxMTlBQ0E4NEIxM0QzMUIyNTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/uAA5BZG9iZQBkAAAAAAH/2wCEAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBBwcHDQwNGBAQGBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAIUDIAMBEQACEQEDEQH/3QAEAGT/xAGiAAAABwEBAQEBAAAAAAAAAAAEBQMCBgEABwgJCgsBAAICAwEBAQEBAAAAAAAAAAEAAgMEBQYHCAkKCxAAAgEDAwIEAgYHAwQCBgJzAQIDEQQABSESMUFRBhNhInGBFDKRoQcVsUIjwVLR4TMWYvAkcoLxJUM0U5KismNzwjVEJ5OjszYXVGR0w9LiCCaDCQoYGYSURUaktFbTVSga8uPzxNTk9GV1hZWltcXV5fVmdoaWprbG1ub2N0dXZ3eHl6e3x9fn9zhIWGh4iJiouMjY6PgpOUlZaXmJmam5ydnp+So6SlpqeoqaqrrK2ur6EQACAgECAwUFBAUGBAgDA20BAAIRAwQhEjFBBVETYSIGcYGRMqGx8BTB0eEjQhVSYnLxMyQ0Q4IWklMlomOywgdz0jXiRIMXVJMICQoYGSY2RRonZHRVN/Kjs8MoKdPj84SUpLTE1OT0ZXWFlaW1xdXl9UZWZnaGlqa2xtbm9kdXZ3eHl6e3x9fn9zhIWGh4iJiouMjY6Pg5SVlpeYmZqbnJ2en5KjpKWmp6ipqqusra6vr/2gAMAwEAAhEDEQA/AD4zV3yxqbSVicUI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";
            image.onload = function() {
                texture.setImage(image, "cubemap.gif");
            };
            image.src = textureSrc;

            cameraObject.addComponent(camera);

            var gameObject = engine.activeScene.createGameObject();
            meshRenderer = new KICK.scene.MeshRenderer();

            meshRenderer.mesh = new KICK.mesh.Mesh(engine,{dataURI: "kickjs://mesh/uvsphere/?radius=1.5"});
            setMaterial('vertexShaderColor','fragmentShader');
            gameObject.addComponent(meshRenderer);

            addRotatorComponent(cameraObject);
        }

        function setDefaultCubemap(){
            meshRenderer.material.uniforms.skybox.value = engine.project.load(engine.project.ENGINE_TEXTURE_CUBEMAP_WHITE);
        }

        initKick();
    });