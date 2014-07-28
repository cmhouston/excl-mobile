Before pushing a commit, perform the following actions:

1.  Write at least one (1) unit test for *each* method you have added.

2.  Run unit tests (see unit test documentation).

3.  Build and run on iOS device.  Do not push if build fails or runtime errors prevent app startup.  If previously unseen errors occur but *do not* cause the app to crash, determine if they need to be corrected.

4.  On iOS, perform a "smoke test" on all "landing" pages (exhibits, component, post).  If your commit adversely effects any of these, do not push.
	
5.  Build and run on Android device.

6.  Smoke test on Android device.

7.  Verify that continuous integration build and integration tests succeed.