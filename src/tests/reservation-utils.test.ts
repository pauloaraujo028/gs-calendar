import {
  checkTimeConflict,
  formatDate,
  generateTimeSlots,
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

describe("formatDate", () => {
  it("deve formatar data para pt-BR", () => {
    const date = new Date(2026, 2, 5);

    const result = formatDate(date);

    expect(result).toBe("05/03/2026");
  });
});

describe("checkTimeConflict", () => {
  const date = new Date(2026, 2, 5);

  const reservations = [
    {
      id: "1",
      roomId: "room1",
      startTime: new Date("2026-03-05T08:00:00"),
      endTime: new Date("2026-03-05T09:00:00"),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any;

  it("deve detectar conflito de horário", () => {
    const result = checkTimeConflict(
      reservations,
      "room1",
      date,
      "08:30",
      "09:30",
    );

    expect(result.hasConflict).toBe(true);
  });

  it("não deve ter conflito quando horários não se sobrepõem", () => {
    const result = checkTimeConflict(
      reservations,
      "room1",
      date,
      "09:30",
      "10:00",
    );

    expect(result.hasConflict).toBe(false);
  });
});

describe("generateTimeSlots", () => {
  it("deve gerar slots de 30 minutos", () => {
    const reservations: Array<{
      id: string;
      title: string;
      description: string | null;
      startTime: Date;
      endTime: Date;
      status: "ACTIVE" | "CANCELLED";
      roomId: string;
      userId: string | null;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    const roomId = "room-1";

    const selectedDate = new Date("2026-03-05");

    const slots = generateTimeSlots(reservations, roomId, selectedDate);

    expect(slots.length).toBeGreaterThan(0);

    expect(slots[0].time).toBe("07:00");
    expect(slots[1].time).toBe("07:30");
  });
});
