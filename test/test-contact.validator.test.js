import ContactValidator from "../src/js/validators/contact-validator.js";

describe("ContactValidator tests", () => {
  let validator;

  beforeEach(() => {
    validator = new ContactValidator();
  });

  test("validateField - valid address", () => {
    const result = validator.validateField("address", "123 Main St");
    expect(result).toEqual([]); 
  });

  test("validateField - invalid address (too short)", () => {
    const result = validator.validateField("address", "A");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Address must be at least 2 characters long");
  });

  test("validateField - invalid address (too long)", () => {
    const result = validator.validateField("address", "A".repeat(256));
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Address must not exceed 255 characters");
  });

  test("validateField - valid email", () => {
    const result = validator.validateField("email", "example@test.com");
    expect(result).toEqual([]); 
  });

  test("validateField - invalid email (invalid format)", () => {
    const result = validator.validateField("email", "invalid-email");
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid email format");
  });

  test("validateField - valid phone", () => {
    const result = validator.validateField("phone", "999888222");
    expect(result).toEqual([]); 
  });

  test("validateField - invalid phone (too long)", () => {
    const result = validator.validateField("phone", "1".repeat(21));
    expect(result).toHaveLength(2);
    expect(result[0].message).toBe("Invalid phone number format");
    expect(result[1].message).toBe("Phone number must not exceed 20 characters");
  });

  test("validateField - valid Google Maps embed URL", () => {
    const result = validator.validateField(
      "google_maps_embed_url",
      "https://www.google.com/maps/embed?pb=!1m18"
    );
    expect(result).toEqual([]); 
  });

  test("validateField - invalid Google Maps embed URL (wrong format)", () => {
    const result = validator.validateField(
      "google_maps_embed_url",
      "https://example.com/maps"
    );
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe("Invalid Google Maps embed URL format");
  });

  test("validateAll - valid contact object", () => {
    const contact = {
      address: "123 Main St",
      email: "example@test.com",
      phone: "999888222", // Ajustado para cumplir con las reglas del validador
      google_maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18"
    };
    const result = validator.validateAll(contact);
    Object.values(result).forEach((errors) => {
      expect(errors).toEqual([]); 
    });
  });

  test("validateAll - invalid contact object", () => {
    const contact = {
      address: "A",
      email: "invalid-email",
      phone: "1".repeat(21),
      google_maps_embed_url: "https://example.com/maps"
    };
    const result = validator.validateAll(contact);

    expect(result.address).toHaveLength(1);
    expect(result.address[0].message).toBe("Address must be at least 2 characters long");

    expect(result.email).toHaveLength(1);
    expect(result.email[0].message).toBe("Invalid email format");

    expect(result.phone).toHaveLength(2); // Corregido para esperar dos errores
    expect(result.phone[0].message).toBe("Invalid phone number format");
    expect(result.phone[1].message).toBe("Phone number must not exceed 20 characters");

    expect(result.google_maps_embed_url).toHaveLength(1);
    expect(result.google_maps_embed_url[0].message).toBe("Invalid Google Maps embed URL format");
  });
});
