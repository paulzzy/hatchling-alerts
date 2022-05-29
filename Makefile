.PHONY: firefox, chromium, clean

firefox:
	tools/build-firefox.sh

chromium:
	tools/build-chromium.sh

clean:
	rm -r build/*
