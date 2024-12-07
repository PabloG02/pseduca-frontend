import assert from "assert";
import UserValidator from "../js/validators/user-validator.js";

function runTests() {
  let validator;

  console.log("Running UserValidator tests...");

  function beforeEach() {
    validator = new UserValidator();
  }

  function test(name, callback) {
    try {
      beforeEach();
      callback();
      console.log(`[Ok] Test passed: ${name}`);
    } catch (error) {
      console.error(`[X] Test failed: ${name}`);
      console.error(error);
    }
  }

  // Tests
  test("validateField - valid username", () => {
    const result = validator.validateField("username", "validUser123");
    assert.deepStrictEqual(result, []); // No errors expected
  });

  test("validateField - invalid username (too short)", () => {
    const result = validator.validateField("username", "ab");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(
      result[0].message,
      "Username must be at least 3 characters long"
    );
  });

  test("validateField - valid password", () => {
    const result = validator.validateField("password", "Valid1@Password");
    assert.deepStrictEqual(result, []); // No errors expected
  });

  test("validateField - invalid password (missing special character)", () => {
    const result = validator.validateField("password", "ValidPassword1");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(
      result[0].message,
      "Must include at least one special character"
    );
  });

  test("validateField - valid email", () => {
    const result = validator.validateField("email", "user@example.com");
    assert.deepStrictEqual(result, []); // No errors expected
  });

  test("validateField - invalid email (no domain)", () => {
    const result = validator.validateField("email", "user@.com");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].message, "Invalid email format");
  });

  test("validateField - valid name", () => {
    const result = validator.validateField("name", "John Doe");
    assert.deepStrictEqual(result, []); // No errors expected
  });

  test("validateField - invalid name (contains numbers)", () => {
    const result = validator.validateField("name", "John123");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(
      result[0].message,
      "Name can only contain letters, spaces, apostrophes, and hyphens"
    );
  });

  test("validateAll - valid user object", () => {
    const user = {
      username: "validUser123",
      password: "Valid1@Password",
      email: "user@example.com",
      name: "John Doe",
    };
    const result = validator.validateAll(user);
    for (const field in result) {
      assert.deepStrictEqual(result[field], []); // No errors expected for any field
    }
  });

  test("validateAll - invalid user object", () => {
    const user = {
      username: "ab",
      password: "weakpass",
      email: "invalid-email",
      name: "John123",
    };
    const result = validator.validateAll(user);

    assert.strictEqual(result.username.length, 1);
    assert.strictEqual(
      result.username[0].message,
      "Username must be at least 3 characters long"
    );

    assert.strictEqual(result.password.length, 3); // Missing upper, special, and number

    assert.strictEqual(result.email.length, 1);
    assert.strictEqual(result.email[0].message, "Invalid email format");

    assert.strictEqual(result.name.length, 1);
    assert.strictEqual(
      result.name[0].message,
      "Name can only contain letters, spaces, apostrophes, and hyphens"
    );
  });
}

runTests();
