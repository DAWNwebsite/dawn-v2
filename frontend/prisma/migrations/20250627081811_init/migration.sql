-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "dateOfBirth" DATETIME,
    "hasParentalConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LearningProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "learningDisabilities" JSONB NOT NULL,
    "learningStyle" TEXT,
    "difficultyLevel" TEXT NOT NULL DEFAULT 'beginner',
    "preferredSubjects" JSONB NOT NULL,
    "accommodations" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiagnosticResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assessmentType" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "confidence" REAL NOT NULL,
    "indicators" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DiagnosticResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParentalConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "relationshipToChild" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentDate" DATETIME,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ParentalConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccessibilityPreferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "highContrast" BOOLEAN NOT NULL DEFAULT false,
    "largeText" BOOLEAN NOT NULL DEFAULT false,
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
    "screenReader" BOOLEAN NOT NULL DEFAULT false,
    "keyboardNavigation" BOOLEAN NOT NULL DEFAULT false,
    "colorBlindFriendly" BOOLEAN NOT NULL DEFAULT false,
    "dyslexiaFriendly" BOOLEAN NOT NULL DEFAULT false,
    "focusIndicators" BOOLEAN NOT NULL DEFAULT true,
    "simplifiedLayout" BOOLEAN NOT NULL DEFAULT false,
    "textToSpeech" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AccessibilityPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "difficultyLevel" TEXT NOT NULL DEFAULT 'beginner',
    "estimatedTime" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentData" JSONB NOT NULL,
    "difficultyLevel" TEXT NOT NULL DEFAULT 'beginner',
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "estimatedTime" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentBlock_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LearningModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT,
    "contentBlockId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "score" REAL,
    "timeSpent" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LearningModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_contentBlockId_fkey" FOREIGN KEY ("contentBlockId") REFERENCES "ContentBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT,
    "type" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastActivity" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "canMessage" BOOLEAN NOT NULL DEFAULT true,
    "canModerate" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" DATETIME,
    CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "readBy" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProfile_userId_key" ON "LearningProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentalConsent_userId_key" ON "ParentalConsent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessibilityPreferences_userId_key" ON "AccessibilityPreferences"("userId");

-- CreateIndex
CREATE INDEX "LearningModule_subject_targetAudience_idx" ON "LearningModule"("subject", "targetAudience");

-- CreateIndex
CREATE INDEX "LearningModule_order_idx" ON "LearningModule"("order");

-- CreateIndex
CREATE INDEX "ContentBlock_moduleId_order_idx" ON "ContentBlock"("moduleId", "order");

-- CreateIndex
CREATE INDEX "ContentBlock_contentType_idx" ON "ContentBlock"("contentType");

-- CreateIndex
CREATE INDEX "UserProgress_userId_status_idx" ON "UserProgress"("userId", "status");

-- CreateIndex
CREATE INDEX "UserProgress_lastAccessed_idx" ON "UserProgress"("lastAccessed");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_moduleId_key" ON "UserProgress"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_contentBlockId_key" ON "UserProgress"("userId", "contentBlockId");

-- CreateIndex
CREATE INDEX "Conversation_status_lastActivity_idx" ON "Conversation"("status", "lastActivity");

-- CreateIndex
CREATE INDEX "Conversation_type_priority_idx" ON "Conversation"("type", "priority");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_isDeleted_createdAt_idx" ON "Message"("isDeleted", "createdAt");
