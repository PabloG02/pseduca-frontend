import ArticleValidator from "../src/js/validators/article-validator";

describe("ArticleValidator tests", () => {
    let validator;
  
    beforeEach(() => {
      validator = new ArticleValidator();
    });
  
    test("validateField - valid article title", () => {
        const result = validator.validateField("title", "Intro to Programming");
        expect(result).toEqual([]);
      });
    
    test("validateField - invalid article title (too short)", () => {
        const result = validator.validateField("title", "A");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Title must be at least 2 characters long");
      });
    
    test("validateField - invalid article title (too long)", () => {
        const result = validator.validateField("title", "A".repeat(256));
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Title must not exceed 255 characters");
    });

    test("validateField - valid article subtitle", () => {
        const result = validator.validateField("subtitle", "Intro to Programming");
        expect(result).toEqual([]);
      });
    
    test("validateField - invalid article subtitle (too short)", () => {
        const result = validator.validateField("subtitle", "A");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Subtitle must be at least 2 characters long");
      });
    
    test("validateField - invalid article subtitle (too long)", () => {
        const result = validator.validateField("subtitle", "A".repeat(256));
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Subtitle must not exceed 255 characters");
    });

    test("validateField - valid article body", () => {
        const result = validator.validateField("body", "Intro to Programming");
        expect(result).toEqual([]);
      });
    
    test("validateField - invalid article body (too short)", () => {
        const result = validator.validateField("body", "A");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Body must be at least 2 characters long");
      });
    
    test("validateField - invalid article body (too long)", () => {
        const result = validator.validateField("body", "A".repeat(256));
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Body must not exceed 255 characters");
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

    test("validateField - valid image URL", () => {
        const result = validator.validateField("image_alt", "https://example.com/image.jpg");
        expect(result).toEqual([]);
    });
    
    test("validateField - invalid image URL", () => {
        const result = validator.validateField("image_alt", "https://example.com/image.txt");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");
    });

    test("validateField - valid article author", () => {
        const result = validator.validateField("author", "Intro to Programming");
        expect(result).toEqual([]);
      });
    
    test("validateField - invalid article author (too short)", () => {
        const result = validator.validateField("author", "A");
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Author must be at least 2 characters long");
      });
    
    test("validateField - invalid article author (too long)", () => {
        const result = validator.validateField("author", "A".repeat(256));
        expect(result).toHaveLength(1);
        expect(result[0].message).toBe("Author must not exceed 100 characters");
    });

    test("validateAll - valid article object", () => {
        const article = {
          title: "The title",
          subtitle: "This is subtitle.",
          body: "The body is very importante.",
          image_uri: "https://example.com/image.jpg",
          image_alt: "https://example.com/image.jpg",
          author: "Pepe Garcia Rodriguez"
        };
        const result = validator.validateAll(article);
        Object.values(result).forEach((errors) => {
          expect(errors).toEqual([]);
        });
      });
    
      test("validateAll - invalid article object", () => {
        const article = {
          title: "A",
          subtitle: "A".repeat(1001),
          body: "A",
          image_uri: "https://example.com/image.txt",
          image_alt: "https://example.com/image.txt",
          author: "A"
        };
        const result = validator.validateAll(article);
    
        expect(result.title).toHaveLength(1);
        expect(result.title[0].message).toBe("Title must be at least 2 characters long");
    
        expect(result.subtitle).toHaveLength(1);
        expect(result.subtitle[0].message).toBe("Subtitle must not exceed 255 characters");
    
        expect(result.body).toHaveLength(1);
        expect(result.body[0].message).toBe("Body must be at least 2 characters long");
    
        expect(result.image_uri).toHaveLength(1);
        expect(result.image_uri[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");
    
        expect(result.image_alt).toHaveLength(1);
        expect(result.image_alt[0].message).toBe("Image URL must be a valid JPG, JPEG, PNG, or GIF file");
    
        expect(result.author).toHaveLength(1);
        expect(result.author[0].message).toBe("Author must be at least 2 characters long");
      });


});