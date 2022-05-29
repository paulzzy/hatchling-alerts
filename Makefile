.PHONY: all firefox chromium clean

all: firefox chromium

firefox:
	tools/build-firefox.sh

chromium:
	tools/build-chromium.sh

clean:
	rm -r build/*
