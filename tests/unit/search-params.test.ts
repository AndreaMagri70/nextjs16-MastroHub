import { describe, expect, it } from "vitest";

import { parsePaginationParams } from "@/lib/search-params";

describe("parsePaginationParams", () => {
  it("usa valori predefiniti quando i parametri mancano", () => {
    expect(parsePaginationParams({})).toEqual({
      searchQuery: undefined,
      currentPage: 1,
      pageSize: 10,
      skip: 0,
    });
  });

  it("pulisce la query dagli spazi", () => {
    expect(
      parsePaginationParams({
        query: "  rossi  ",
      }),
    ).toMatchObject({
      searchQuery: "rossi",
    });
  });

  it("trasforma query vuote in undefined", () => {
    expect(
      parsePaginationParams({
        query: "   ",
      }),
    ).toMatchObject({
      searchQuery: undefined,
    });
  });

  it("calcola skip in base alla pagina corrente", () => {
    expect(
      parsePaginationParams({
        page: "3",
        pageSize: 10,
      }),
    ).toMatchObject({
      currentPage: 3,
      skip: 20,
    });
  });

  it("corregge pagine non valide riportandole a 1", () => {
    expect(parsePaginationParams({ page: "abc" })).toMatchObject({
      currentPage: 1,
      skip: 0,
    });

    expect(parsePaginationParams({ page: "-5" })).toMatchObject({
      currentPage: 1,
      skip: 0,
    });
  });
});