import dayjs from "dayjs";

export const formatDate = (dateTime: string) =>
	dayjs(new Date(dateTime)).format("MMM DD, YYYY");

export const formatYear = (dateTime: string) =>
	dayjs(new Date(dateTime)).format("YYYY");
