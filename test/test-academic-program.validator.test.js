import AcademicProgramValidator from "../src/js/validators/academic-program-validator.js";

describe("AcademicProgramValidator tests", () => {
    let validator;
  
    beforeEach(() => {
      validator = new AcademicProgramValidator();
    });
  
    test("validateField - valid academic program name", () => {
      const result = validator.validateField("name", "Intro to Programming");
      expect(result).toEqual([]);
    });
  
    test("validateField - invalid academic program name (too short)", () => {
      const result = validator.validateField("name", "A");
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe("Academic program name must be at least 2 characters long");
    });
  
    test("validateField - invalid academic program name (too long)", () => {
      const result = validator.validateField("name", "A".repeat(256));
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe("Academic program name must not exceed 255 characters");
    });
  
    test("validateField - valid qualification level", () => {
        const result = validator.validateField("qualification_level", "Intro to Programming");
        expect(result).toEqual([]);
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
    
    test("validateField - valid image URL", () => {
        const result = validator.validateField("image_uri", "https://example.com/image.jpg");
        expect(result).toEqual([]);
    });
    
    test("validateField - invalid image URL", () => {
        const result = validator.validateField("image_uri", "https://example.com/image.txt");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");
    });

    test("validateField - valid available_slots", () => {
        const result = validator.validateField("available_slots", "123");
        expect(result).toEqual([]); 
    });
    
    test("validateField - invalid available_slots (not an integer)", () => {
        const result = validator.validateField("available_slots", "abc");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Available slots must be an integer");
    });
    
    test("validateField - valid teaching type", () => {
        const result = validator.validateField("teaching_type", "Teaching type is required");
        expect(result).toEqual([]);
    });

    test("validateField - valid offering frequency", () => {
        const result = validator.validateField("offering_frequency", "Offering frequency is required");
        expect(result).toEqual([]);
    });

    test("validateField - valid duration_ects", () => {
        const result = validator.validateField("duration_ects", "123");
        expect(result).toEqual([]);
    });

    test("validateField - invalid duration_ects (not an integer)", () => {
        const result = validator.validateField("duration_ects", "abc");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Duration must be an integer");
    });
    
    test("validateField - valid location", () => {
        const result = validator.validateField("location", "Location is required");
        expect(result).toEqual([]);
    });
    
    test("validateField - invalid location (too short)", () => {
        const result = validator.validateField("location", "A");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Location must be at least 2 characters long");
    });

    test("validateField - invalid location (too long)", () => {
        const result = validator.validateField("location", "A".repeat(1001));
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Location must not exceed 50 characters");
      });

    test("validateField - valid academic program URL", () => {
        const result = validator.validateField("url", "https://example.com");
        expect(result).toEqual([]);
    });
    
    test("validateField - invalid academic program URL", () => {
        const result = validator.validateField("url", "invalid-url");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Invalid academic program URL format");
    });

    test("validateAll - valid course object", () => {
      const academicprogram = {
        name: "Intro to Programming",
        qualification_level: "Master",
        description: "This is a academic program.",
        image_uri: "https://example.com/image.jpg",
        image_alt: "https://example.com/image.jpg",
        available_slots: "12",
        teaching_type: "Online",
        offering_frequency: "Annual",
        duration_ects: "12",
        location: "Ourense",
        url: "https://example.com"
      };
      const result = validator.validateAll(academicprogram);
      Object.values(result).forEach((errors) => {
        expect(errors).toEqual([]);
      });
    });
  
    test("validateAll - invalid course object", () => {
      const academicprogram = {
        name: "P",
        qualification_level: "",
        description: "A".repeat(1001),
        image_uri: "https://example.com/image.txt",
        image_alt: "https://example.com/image.txt",
        available_slots: "h",
        teaching_type: "",
        offering_frequency: "",
        duration_ects: "ab",
        location: "a",
        url: "invalid"
      };
      const result = validator.validateAll(academicprogram);

      expect(result.name).toHaveLength(1);
      expect(result.name[0].message).toBe("Academic program name must be at least 2 characters long");

      expect(result.description).toHaveLength(1);
      expect(result.description[0].message).toBe("Description must not exceed 1000 characters");

      expect(result.image_uri).toHaveLength(1);
      expect(result.image_uri[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");

      expect(result.available_slots).toHaveLength(1);
      expect(result.available_slots[0].message).toBe("Available slots must be an integer");

      expect(result.duration_ects).toHaveLength(1);
      expect(result.duration_ects[0].message).toBe("Duration must be an integer");

      expect(result.url).toHaveLength(1);
      expect(result.url[0].message).toBe("Invalid academic program URL format");
    });
  });