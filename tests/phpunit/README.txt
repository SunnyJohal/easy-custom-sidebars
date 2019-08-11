# PHPUnit Tests

## Summary

Here is what happens when the test envionment is set up:

1. If you have run `bin/install-wp-tests.sh` in the terminal then you should have a working test install complete with a test database ready for unit testing. Create a clean MySQL database and user. **DO NOT USE AN EXISTING DATABASE** or you will lose data, guaranteed.

2. Run the command `composer test` to run the unit tests for php.

3. phpunit will initialize and install a (more or less) complete running copy of WordPress each time it is run.

4. Changes to the test database will be rolled back as tests are finished, to ensure a clean start next time the tests are run.
