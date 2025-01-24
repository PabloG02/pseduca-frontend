import TeamMemberValidator from "../src/js/validators/team-member-validator.js";

describe("TeamMemberValidator tests", () => {
  let validator;

  beforeEach(() => {
    validator = new TeamMemberValidator();
  });

  test("validateField - valid name", () => {
    const result = validator.validateField("name", "John Doe");
    expect(result).toEqual([]); 
  });

  test("validateField - invalid name (too short)", () => {
    const result = validator.validateField("name", "J");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Name must be at least 2 characters long");
  });

  test("validateField - invalid name (too long)", () => {
    const result = validator.validateField("name", "J".repeat(51));
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Name must not exceed 50 characters");
  });

  test("validateField - invalid name (contains numbers)", () => {
    const result = validator.validateField("name", "John123");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Name can only contain letters, spaces, apostrophes, and hyphens");
  });

  test("validateField - valid email", () => {
    const result = validator.validateField("email", "john@example.com");
    expect(result).toEqual([]); 
  });

  test("validateField - invalid email (invalid format)", () => {
    const result = validator.validateField("email", "invalid-email");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid email format");
  });

  test("validateField - valid biography", () => {
    const result = validator.validateField("biography", "This is a brief biography.");
    expect(result).toEqual([]); 
  });

  test("validateField - invalid biography (too long)", () => {
    const result = validator.validateField("biography", "A".repeat(1001));
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Biography must not exceed 1000 characters");
  });

  test("validateField - valid researcher_id", () => {
    const result = validator.validateField("researcher_id", "123");
    expect(result).toEqual([]); 
  });

  test("validateField - invalid researcher_id (not an integer)", () => {
    const result = validator.validateField("researcher_id", "abc");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Researcher ID must be an integer");
  });

  test("validateAll - valid team member object", () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      biography: "A brief biography about John.",
      researcher_id: "123",
    };
    const result = validator.validateAll(user);
    Object.values(result).forEach((errors) => {
      expect(errors).toEqual([]); 
    });
  });

  test("validateAll - invalid team member object", () => {
    const user = {
      name: "J",
      email: "invalid-email",
      biography: "A".repeat(1001),
      researcher_id: "abc",
    };
    const result = validator.validateAll(user);

    expect(result.name).toHaveLength(1);
    expect(result.name[0].message).toBe("Name must be at least 2 characters long");

    expect(result.email).toHaveLength(1);
    expect(result.email[0].message).toBe("Invalid email format");

    expect(result.biography).toHaveLength(1);
    expect(result.biography[0].message).toBe("Biography must not exceed 1000 characters");

    expect(result.researcher_id).toHaveLength(1);
    expect(result.researcher_id[0].message).toBe("Researcher ID must be an integer");
  });
});
