import UserValidator from "../src/js/validators/user-validator.js";

describe("UserValidator tests", () => {
  let validator;

  beforeEach(() => {
    validator = new UserValidator();
  });

  test("validateField - valid username", () => {
    const result = validator.validateField("username", "validUser123");
    expect(result).toEqual([]); // No errors expected
  });

  test("validateField - invalid username (too short)", () => {
    const result = validator.validateField("username", "ab");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Username must be at least 3 characters long");
  });

  test("validateField - valid password", () => {
    const result = validator.validateField("password", "Valid1@Password");
    expect(result).toEqual([]); // No errors expected
  });

  test("validateField - invalid password (missing special character)", () => {
    const result = validator.validateField("password", "ValidPassword1");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Must include at least one special character");
  });

  test("validateField - valid email", () => {
    const result = validator.validateField("email", "user@example.com");
    expect(result).toEqual([]); // No errors expected
  });

  test("validateField - invalid email (no domain)", () => {
    const result = validator.validateField("email", "user@.com");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid email format");
  });

  test("validateField - valid name", () => {
    const result = validator.validateField("name", "John Doe");
    expect(result).toEqual([]); // No errors expected
  });

  test("validateField - invalid name (contains numbers)", () => {
    const result = validator.validateField("name", "John123");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Name can only contain letters, spaces, apostrophes, and hyphens");
  });

  test("validateAll - valid user object", () => {
    const user = {
      username: "validUser123",
      password: "Valid1@Password",
      email: "user@example.com",
      name: "John Doe",
    };
    const result = validator.validateAll(user);
    Object.values(result).forEach((errors) => {
      expect(errors).toEqual([]); // No errors expected for any field
    });
  });

  test("validateAll - invalid user object", () => {
    const user = {
      username: "ab",
      password: "weakpass",
      email: "invalid-email",
      name: "John123",
    };
    const result = validator.validateAll(user);

    expect(result.username).toHaveLength(1);
    expect(result.username[0].message).toBe("Username must be at least 3 characters long");

    expect(result.password).toHaveLength(3); // Missing upper, special, and number

    expect(result.email).toHaveLength(1);
    expect(result.email[0].message).toBe("Invalid email format");

    expect(result.name).toHaveLength(1);
    expect(result.name[0].message).toBe("Name can only contain letters, spaces, apostrophes, and hyphens");
  });
});
