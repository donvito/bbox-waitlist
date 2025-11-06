import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.json");

interface WaitlistEntry {
  email: string;
  timestamp: string;
}

// Ensure data directory and file exist
async function ensureDataFile() {
  const dataDir = path.dirname(DATA_FILE);
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read waitlist data
async function readWaitlist(): Promise<WaitlistEntry[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// Write waitlist data
async function writeWaitlist(data: WaitlistEntry[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Read existing waitlist
    const waitlist = await readWaitlist();

    // Check for duplicates
    const exists = waitlist.some((entry) => entry.email === trimmedEmail);
    if (exists) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      );
    }

    // Add new entry
    const newEntry: WaitlistEntry = {
      email: trimmedEmail,
      timestamp: new Date().toISOString(),
    };

    waitlist.push(newEntry);
    await writeWaitlist(waitlist);

    return NextResponse.json(
      {
        message: "Successfully joined the waitlist! We'll notify you when we launch.",
        position: waitlist.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const waitlist = await readWaitlist();
    return NextResponse.json({
      count: waitlist.length,
      message: "Waitlist count retrieved successfully",
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
