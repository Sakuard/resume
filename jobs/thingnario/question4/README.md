I was initially concerned about potential security issues at runtime, so I ran docker inspect and docker to check for any unexpected behavior.
While reviewing the layer history, I spotted a rm question4-answer.txt command. Since RUN rm does not erase data from earlier layers, I inferred that the file might still exist in a previous layer.
I then unpacked the image and recovered the file directly from the layers.

docker history --no-trunc asia-east1-docker.pkg.dev/staging-photon-pv/sre-interview/sre-interview:MattHuang7451 | grep 'question4'
<missing> 2 days ago    RUN /bin/sh -c rm /home/question4/question4-answer.txt              # buildkit 12.3kB    buildkit.dockerfile.v0
<missing> 2 days ago    COPY /app/question4-answer.txt /home/question4/question4-answer.txt # buildkit 16.4kB    buildkit.dockerfile.v0
<missing> 2 days ago    COPY question4/question4 /home/question4/                           # buildkit 


docker save asia-east1-docker.pkg.dev/staging-photon-pv/sre-interview/sre-interview:MattHuang7451 -o ./tmp/sre_img.tar
mkdir -p ./tmp/sre_layers
tar xf ./tmp/sre_img.tar -C ./tmp/sre_layers

for layer in ./tmp/sre_layers/blobs/sha256/*; do
  if file "$layer" | grep -q "POSIX tar"; then
    if tar tf "$layer" 2>/dev/null | grep -q "question4-answer"; then
      echo "=== Found in layer: $layer ==="
      tar xf "$layer" -O home/question4/question4-answer.txt 2>/dev/null
    fi
  fi
done