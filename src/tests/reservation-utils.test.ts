import {
  getTimeOptions,
  isValidTimeRange,
  timeToMinutes,
} from "../lib/reservation-utils";

describe("timeToMinutes", () => {
  it("deve converter hora para minutos", () => {
    const result = timeToMinutes("08:30");

    expect(result).toBe(510);
  });

  it("deve converter 07:00 corretamente", () => {
    const result = timeToMinutes("07:00");

    expect(result).toBe(420);
  });

  it("deve converter meia noite", () => {
    const result = timeToMinutes("00:00");

    expect(result).toBe(0);
  });
});

describe("isValidTimeRange", () => {
  it("deve aceitar horário válido", () => {
    const result = isValidTimeRange("08:00", "09:00");

    expect(result).toBe(true);
  });

  it("deve rejeitar quando fim é antes do início", () => {
    const result = isValidTimeRange("10:00", "09:00");

    expect(result).toBe(false);
  });

  it("deve rejeitar duração menor que 30min", () => {
    const result = isValidTimeRange("08:00", "08:15");

    expect(result).toBe(false);
  });

  it("deve rejeitar horário antes das 07:00", () => {
    const result = isValidTimeRange("06:00", "07:00");

    expect(result).toBe(false);
  });

  it("não deve aceitar horários iguais", () => {
    const result = isValidTimeRange("08:00", "08:00");

    expect(result).toBe(false);
  });
});

describe("getTimeOptions", () => {
  it("deve gerar horários", () => {
    const options = getTimeOptions();

    expect(options.length).toBeGreaterThan(0);
  });

  it("deve conter 07:00", () => {
    const options = getTimeOptions();

    expect(options).toContain("07:00");
  });

  it("deve conter 17:00", () => {
    const options = getTimeOptions();

    expect(options).toContain("17:00");
  });
});
