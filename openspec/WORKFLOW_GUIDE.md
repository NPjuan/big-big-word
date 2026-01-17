# OpenSpec Workflow Guide for Big Big Word

## ✅ Completed Tasks

### 1. Project Context (project.md) - FILLED ✓

I've populated `openspec/project.md` with comprehensive details about your project:

- **Purpose**: Vocabulary learning app for English learners
- **Tech Stack**: Vue 3, TypeScript, Vite, Vuetify, TailwindCSS, Pinia
- **Conventions**: Code style, architecture patterns, testing strategy
- **Domain Context**: Word management, learning features
- **Constraints**: Client-side only, localStorage, external API dependencies

### 2. Example Change Proposal - CREATED ✓

I've created a complete change proposal at `openspec/changes/add-word-export/`:

- **proposal.md**: Explains why we need word export, what changes, and impact
- **tasks.md**: Detailed implementation checklist with 4 sections
- **specs/word-management/spec.md**: Formal requirements with scenarios

## 📚 OpenSpec Workflow Summary

### Three-Stage Process

#### Stage 1: Creating Changes (Planning)

```
User Request → Check if proposal needed → Create change-id → Write proposal
→ Define requirements → Create tasks → Validate → Request approval
```

**When to create a proposal:**

- ✅ New features (like word export)
- ✅ Breaking changes
- ✅ Architecture changes
- ❌ Bug fixes (just fix directly)
- ❌ Typos, formatting

**Key files:**

- `proposal.md` - The "why" and "what"
- `tasks.md` - The "how" (step-by-step)
- `specs/[capability]/spec.md` - The formal requirements
- `design.md` - Technical decisions (optional, for complex changes)

#### Stage 2: Implementing Changes (Building)

```
Read proposal → Read design → Read tasks → Implement sequentially
→ Mark tasks complete → Update checklist
```

**Important:** Don't start until proposal is approved!

#### Stage 3: Archiving Changes (Cleanup)

```
Deploy to production → Move to archive/ → Update specs/ → Validate
```

### Directory Structure

```
openspec/
├── project.md              # ✓ Your project context (FILLED)
├── specs/                  # Current truth (what IS built)
│   └── word-management/    # Will be created when change is archived
│       └── spec.md
├── changes/                # Proposals (what SHOULD change)
│   ├── add-word-export/    # ✓ Example proposal (CREATED)
│   │   ├── proposal.md
│   │   ├── tasks.md
│   │   └── specs/
│   │       └── word-management/
│   │           └── spec.md
│   └── archive/            # Completed changes (after deployment)
```

## 🎯 How to Work with Me Using OpenSpec

### For New Features

**You say:** "I want to add [FEATURE]"

**I will:**

1. Check existing specs and changes
2. Create a unique `change-id` (e.g., `add-word-import`)
3. Write `proposal.md` explaining why and what
4. Create `tasks.md` with implementation steps
5. Write `specs/[capability]/spec.md` with formal requirements
6. Validate the proposal

**You do:**

- Review the proposal
- Approve or request changes
- I implement the tasks sequentially
- We mark tasks complete together

### For Bug Fixes

**You say:** "There's a bug in [FEATURE]"

**I will:**

- Fix it directly (no proposal needed)
- Explain what was wrong and how I fixed it

### For Questions

**You say:** "How does [FEATURE] work?"

**I will:**

- Check `openspec/specs/` for existing documentation
- Check `openspec/changes/` for pending changes
- Explain based on specs or code

## 📝 Spec File Format (Important!)

### Requirements Structure

```markdown
## ADDED Requirements ← For new features

## MODIFIED Requirements ← For changes to existing features

## REMOVED Requirements ← For deprecated features

### Requirement: Feature Name ← Clear, descriptive name

The system SHALL [do something]. ← Use SHALL/MUST

#### Scenario: Success case ← MUST use #### (4 hashtags)

- **WHEN** user does X ← Condition
- **THEN** system does Y ← Expected result
- **AND** also does Z ← Additional results
```

### Common Mistakes to Avoid

❌ `- **Scenario: Name**` (bullet point)
❌ `**Scenario**: Name` (bold text)
❌ `### Scenario: Name` (3 hashtags)
✅ `#### Scenario: Name` (4 hashtags) ← CORRECT!

## 🛠️ Useful Commands

```bash
# See what's in progress
openspec list

# See existing capabilities
openspec list --specs

# View a change or spec
openspec show add-word-export
openspec show word-management --type spec

# Validate before requesting approval
openspec validate add-word-export --strict --no-interactive

# After deployment, archive the change
openspec archive add-word-export --yes
```

## 💡 Example Workflow

### Scenario: You want to add word import feature

**Step 1: You request**

```
"I want to add a feature to import words from a CSV file"
```

**Step 2: I create proposal**

- Create `openspec/changes/add-word-import/`
- Write proposal explaining why and what
- Define requirements with scenarios
- Create implementation tasks

**Step 3: You review and approve**

```
"Looks good, please implement it"
```

**Step 4: I implement**

- Follow tasks.md sequentially
- Update code files
- Mark tasks complete
- Test functionality

**Step 5: After deployment**

```
"The feature is deployed, please archive the change"
```

**Step 6: I archive**

- Move to `archive/2026-01-17-add-word-import/`
- Update `specs/word-management/spec.md`
- Validate everything passes

## 🎓 Key Principles

1. **Specs are truth** - They document what IS built
2. **Changes are proposals** - They document what SHOULD change
3. **Always validate** - Run `openspec validate` before approval
4. **Keep it simple** - Default to <100 lines of code
5. **One capability, one purpose** - Don't mix unrelated features
6. **Scenarios are mandatory** - Every requirement needs at least one scenario

## 📖 Next Steps

1. **Review the example proposal**: Check `openspec/changes/add-word-export/`
2. **Try the workflow**: Tell me a feature you want to add
3. **Ask questions**: If anything is unclear, just ask!

## 🔗 Quick Reference

- **Project context**: `openspec/project.md`
- **Active changes**: `openspec/changes/`
- **Current specs**: `openspec/specs/`
- **Archived changes**: `openspec/changes/archive/`
- **Example proposal**: `openspec/changes/add-word-export/`

---

**Remember**: OpenSpec helps us plan before we code, ensuring we build the right thing the right way. It's like having a blueprint before building a house! 🏗️
