import CourseValidator from "../src/js/validators/course-validator.js";

describe("CourseValidator tests", () => {
  let validator;

  beforeEach(() => {
    validator = new CourseValidator();
  });

  test("validateField - valid course name", () => {
    const result = validator.validateField("name", "Intro to Programming");
    expect(result).toEqual([]);
  });

  test("validateField - invalid course name (too short)", () => {
    const result = validator.validateField("name", "A");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Course name must be at least 2 characters long");
  });

  test("validateField - invalid course name (too long)", () => {
    const result = validator.validateField("name", "A".repeat(256));
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Course name must not exceed 255 characters");
  });

  test("validateField - valid description", () => {
    const result = validator.validateField("description", "This is a course description.");
    expect(result).toEqual([]);
  });

  test("validateField - invalid description (too long)", () => {
    const result = validator.validateField("description", "A".repeat(1001));
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Description must not exceed 1000 characters");
  });

  test("validateField - valid start date", () => {
    const result = validator.validateField("start_date", "2023-01-01");
    expect(result).toEqual([]);
  });

  test("validateField - invalid start date", () => {
    const result = validator.validateField("start_date", "2023-02-31");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid start date format");
  });

  test("validateField - valid end date", () => {
    const result = validator.validateField("end_date", "2023-12-31");
    expect(result).toHaveLength(0);
  });

  test("validateField - invalid end date", () => {
    const result = validator.validateField("end_date", "2024-04-31");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid end date format");
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

  test("validateField - valid course URL", () => {
    const result = validator.validateField("url", "https://example.com");
    expect(result).toEqual([]);
  });

  test("validateField - invalid course URL", () => {
    const result = validator.validateField("url", "invalid-url");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid course URL format");
  });

  test("validateAll - valid course object", () => {
    const course = {
      name: "Intro to Programming",
      description: "This is a beginner course.",
      start_date: "2023-01-01",
      end_date: "2023-12-31",
      image_uri: "https://example.com/image.jpg",
      url: "https://example.com"
    };
    const result = validator.validateAll(course);
    Object.values(result).forEach((errors) => {
      expect(errors).toEqual([]);
    });
  });

  test("validateAll - invalid course object", () => {
    const course = {
      name: "A",
      description: "A".repeat(1001),
      start_date: "2024-04-31",
      end_date: "2024-02-30",
      image_uri: "https://example.com/image.txt",
      url: "invalid-url"
    };
    const result = validator.validateAll(course);

    expect(result.name).toHaveLength(1);
    expect(result.name[0].message).toBe("Course name must be at least 2 characters long");

    expect(result.description).toHaveLength(1);
    expect(result.description[0].message).toBe("Description must not exceed 1000 characters");

    expect(result.start_date).toHaveLength(1);
    expect(result.start_date[0].message).toBe("Invalid start date format");

    expect(result.end_date).toHaveLength(1);
    expect(result.end_date[0].message).toBe("Invalid end date format");

    expect(result.image_uri).toHaveLength(1);
    expect(result.image_uri[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");

    expect(result.url).toHaveLength(1);
    expect(result.url[0].message).toBe("Invalid course URL format");
  });
});
