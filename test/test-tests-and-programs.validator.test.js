import TestingProgramsValidator from "../src/js/validators/tests-and-programs-validator.js";

describe("TestingProgramsValidator tests", () => {
  let validator;

  beforeEach(() => {
    validator = new TestingProgramsValidator();
  });

  test("validateField - valid tests and programs name", () => {
    const result = validator.validateField("name", "Intro to Programming");
    expect(result).toEqual([]);
  });

  test("validateField - invalid tests and programs name (too short)", () => {
    const result = validator.validateField("name", "A");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Test and programs name must be at least 2 characters long");
  });

  test("validateField - invalid tests and programs name (too long)", () => {
    const result = validator.validateField("name", "A".repeat(256));
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Test and programs name must not exceed 255 characters");
  });

  test("validateField - valid description", () => {
    const result = validator.validateField("description", "This is a tests and programs description.");
    expect(result).toEqual([]);
  });

  test("validateField - invalid description (too long)", () => {
    const result = validator.validateField("description", "A".repeat(1001));
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Description must not exceed 1000 characters");
  });

  test("validateField - valid image URL", () => {
    const result = validator.validateField("image_uri", "https://example.com/image.jpg");
    expect(result).toEqual([]);
  });

  test("validateField - invalid image URL", () => {
    const result = validator.validateField("image_uri", "https://example.com/image.txt");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");
  });

  test("validateField - valid tests and programs URL", () => {
    const result = validator.validateField("url", "https://example.com");
    expect(result).toEqual([]);
  });

  test("validateField - invalid tests and programs URL", () => {
    const result = validator.validateField("url", "invalid-url");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid test and program URL format");
  });

  test("validateAll - valid tests and programs object", () => {
    const testPrograms = {
      name: "Intro to Programming",
      description: "This is a beginner test.",
      url: "https://example.com"
    };
    const result = validator.validateAll(testPrograms);
    Object.values(result).forEach((errors) => {
      expect(errors).toEqual([]);
    });
  });

  test("validateAll - invalid tests and programs object", () => {
    const testPrograms = {
      name: "A",
      description: "A".repeat(1001),
      image_uri: "https://example.com/image.txt",
      url: "invalid-url"
    };
    const result = validator.validateAll(testPrograms);

    expect(result.name).toHaveLength(1);
    expect(result.name[0].message).toBe("Test and programs name must be at least 2 characters long");

    expect(result.description).toHaveLength(1);
    expect(result.description[0].message).toBe("Description must not exceed 1000 characters");

    expect(result.image_uri).toHaveLength(1);
    expect(result.image_uri[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");

    expect(result.url).toHaveLength(1);
    expect(result.url[0].message).toBe("Invalid test and program URL format");
  });
});
