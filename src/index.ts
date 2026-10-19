import type { User, Course, Submission, ApiResponse, UserUpdate, StringOrNumber } from "./types/index";
import { SubmissionStatus, Role } from "./types/index";

const projectName: string = "itelect4-project-gt1";
const currentYear: number = 2026;
const isFullStack: boolean = true;
const nothing: null = null;
const notSet: undefined = undefined;

console.log({ projectName, currentYear, isFullStack, nothing, notSet });

function greet(name: string, year: number): string {
  return `Welcome to ${name} -- AY ${year}!`;
}

function logMessage(message: string): void {
  console.log(message);
}
logMessage(greet(projectName, currentYear));

let anything: any = "hello";
anything = 42;
anything = true;
console.log(anything); 

let userInput: unknown = "test";
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase());
}

function throwError(message: string): never {
  throw new Error(message);
}

const student: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

const course: Course = {
  code: "ITELECT4",
  title: "IT Elective 4",
  units: 3,
  semester: "1st Semester 2026-2027",
};

const mockSubmission: Submission = {
  id: 1,
  studentId: 1,
  courseCode: "ITELECT4",
  repoUrl: "github.com",
  submittedAt: new Date()
};

console.log(student);
console.log(course);
console.log(mockSubmission); 

function processInput(input: StringOrNumber): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}

function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return value;
}
console.log(processInput("hello"));
console.log(processInput(3.14159));
console.log(formatDate(new Date()));

function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const usersList: User[] = [student];
const firstUser = getFirst<User>(usersList);
console.log(`First User Name: ${firstUser?.name}`);

const userResponse: ApiResponse<User> = {
  success: true,
  data: student,
};
console.log(`API Response Status: ${userResponse.success}`);

const profileUpdate: UserUpdate = { name: "Juan D. Cruz" };
console.log(profileUpdate); 

let currentStatus: SubmissionStatus = SubmissionStatus.Pending;
console.log(`Submission Status Index: ${currentStatus}`);

currentStatus = SubmissionStatus.Graded; 
console.log(`Is it graded? ${currentStatus === SubmissionStatus.Graded}`);

const myRole: Role = Role.Student;
console.log(`My Role: ${myRole}`);

if (false) {
  throwError("Test");
}