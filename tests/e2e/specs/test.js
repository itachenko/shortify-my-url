// https://docs.cypress.io/api/introduction/api.html

const clientUrl = "http://localhost:8080";
const serverUrl = "http://localhost:3003";
const invalidUrls = [
  " ",
  "___",
  "http://",
  "http://.",
  "http://??/",
  "http://##/",
  "http://foo.bar?q=Spaces should be encoded",
  "http:///a",
  "rdar://1234",
  "http:// shouldfail.com",
  ":// should fail",
  "http://foo.bar/foo(bar)baz quux",
  "fff",
  "example/com",
  "htt:example.com",
];
const shortUrls = ["http://test.com", "https://google.com"];
const validUrl =
  "https://docs.cypress.io/guides/getting-started/writing-your-first-test.html";

describe("All elements are present", () => {
  beforeEach(() => {
    cy.visit(clientUrl);
  });

  it("title", () => {
    cy.get(".title").contains("Shortify My URL");
  });

  it("long url - input form field", () => {
    cy.get(".short-form-input").should(
      "have.attr",
      "placeholder",
      "Put your long URL here"
    );
  });

  it("long url - input form button", () => {
    cy.get(".short-form-btn").contains("Make it short!");
  });

  it("get stats - input form field", () => {
    cy.get(".stats-form-input").should("have.attr", "placeholder", "Short URL");
  });

  it("get stats - input form button", () => {
    cy.get(".stats-form-btn").contains("Get stats");
  });

  it("about button", () => {
    cy.get(".about-btn").contains("About");
  });
});

describe("Make short - validation messages", () => {
  beforeEach(() => {
    cy.visit(clientUrl);
  });

  it("URL is empty string", () => {
    cy.get(".error-message").should("not.exist");
    cy.get(".short-form-btn").click();
    cy.get(".error-message").contains("URL should not be empty");
  });

  invalidUrls.forEach((url) => {
    it(`URL is invalid: [${url}]`, () => {
      cy.get(".error-message").should("not.exist");
      cy.get(".short-form-input").type(url);
      cy.get(".short-form-btn").click();
      cy.get(".error-message").contains("Invalid URL");
    });
  });

  shortUrls.forEach((url) => {
    it(`URL is too short: [${url}]`, () => {
      cy.get(".error-message").should("not.exist");
      cy.get(".short-form-input").type(url);
      cy.get(".short-form-btn").click();
      cy.get(".error-message").contains(
        "Result URL won't be shorter than original one"
      );
    });
  });
});

describe("Get Stats - validation messages", () => {
  beforeEach(() => {
    cy.visit(clientUrl);
  });

  it("URL is empty string", () => {
    cy.get(".error-message").should("not.exist");
    cy.get(".stats-form-btn").click();
    cy.get(".error-message").contains("URL should not be empty");
  });

  invalidUrls.forEach((url) => {
    it(`URL is invalid: [${url}]`, () => {
      cy.get(".error-message").should("not.exist");
      cy.get(".stats-form-input").type(url);
      cy.get(".stats-form-btn").click();
      cy.get(".error-message").contains("Invalid URL");
    });
  });

  it("URL does not exist", () => {
    cy.get(".error-message").should("not.exist");
    cy.get(".stats-form-input").type("http://example.com");
    cy.get(".stats-form-btn").click();
    cy.get(".error-message").contains(
      "Such short URL was not found in the system"
    );
  });
});

describe("About section", () => {
  beforeEach(() => {
    cy.visit(clientUrl);
  });

  it("should show/hide on button click", () => {
    cy.get(".about").should("not.exist");
    cy.get(".about-btn").click();
    cy.get(".about").should("exist");

    cy.get(".about-btn").click();
    cy.get(".about").should("not.exist");
  });
});

describe("Create short URL", () => {
  beforeEach(() => {
    cy.visit(clientUrl);
  });

  it("URL should be created", () => {
    cy.get(".result-message").should("not.exist");
    cy.get(".result-message-btn").should("not.exist");

    cy.get(".short-form-input").type(validUrl);
    cy.get(".short-form-btn").click();

    cy.get("#result-message").should(
      "include.text",
      `Your short url is: ${serverUrl}`
    );
    cy.get(".result-message-btn").should("exist");
  });

  it("should not create new short URL for same long URL", () => {
    let firstShortUrl = "";
    let secondShortUrl = "";

    cy.get(".short-form-input").type(validUrl);
    cy.get(".short-form-btn").click();
    cy.get(".result-message").should((message) => {
      firstShortUrl = message.text();
    });

    cy.reload();

    cy.get(".short-form-input").type(validUrl);
    cy.get(".short-form-btn").click();
    cy.get(".result-message").should((message) => {
      secondShortUrl = message.text();
    });

    expect(secondShortUrl).to.equal(firstShortUrl);
  });
});

describe("Get stats", () => {
  let shortUrl = "";

  before(() => {
    cy.visit(clientUrl);
    cy.get(".short-form-input").type(validUrl);
    cy.get(".short-form-btn").click();
    cy.get(".result-message").should((message) => {
      shortUrl = message.text();
    });
  });

  it("should get stats for short url", () => {
    cy.get("#stats-message").should("not.exist");

    cy.get(".stats-form-input").type(shortUrl);
    cy.get(".stats-form-btn").click();

    cy.get("#stats-message")
      .should("exist")
      .should((stats) => {
        const text = stats.text();

        expect(text).to.include(`Short URL: ${shortUrl}`);
        expect(text).to.include(`Clicks: 0`);
      });
  });
});
