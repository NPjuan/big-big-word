# System Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Application"
        UI[Vue 3 + Vuetify UI]
        Router[Vue Router]
        Store[Pinia Stores]
        Components[Components]
    end

    subgraph "Service Layer"
        DictService[Dictionary Service]
        TransService[Translation Service]
        AIService[AI Service]
        AudioService[Audio Service]
    end

    subgraph "External APIs"
        DictAPI[Free Dictionary API]
        TransAPI[Translation API]
        OpenAI[OpenAI/Anthropic API]
        WebSpeech[Web Speech API]
    end

    subgraph "Storage"
        LocalStorage[localStorage]
        Cache[In-Memory Cache]
    end

    UI --> Router
    UI --> Components
    Components --> Store
    Store --> DictService
    Store --> TransService
    Store --> AIService
    Store --> AudioService

    DictService --> DictAPI
    TransService --> TransAPI
    AIService --> OpenAI
    AudioService --> WebSpeech

    Store --> LocalStorage
    AIService --> Cache
    DictService --> Cache
```

## Component Architecture

```mermaid
graph TD
    App[App.vue]

    subgraph "Layout Components"
        AppBar[AppBar.vue]
        NavDrawer[NavigationDrawer.vue]
        ThemeToggle[ThemeToggle.vue]
    end

    subgraph "Pages"
        WordLearning[WordLearning.vue]
        WordGallery[WordGallery.vue]
    end

    subgraph "Word Input"
        InputForm[WordInputForm.vue]
        InputValidation[InputValidation.vue]
    end

    subgraph "Word Display"
        WordCard[WordCard.vue]
        PhoneticDisplay[PhoneticDisplay.vue]
        DefinitionSection[DefinitionSection.vue]
        EtymologySection[EtymologySection.vue]
    end

    subgraph "Shared Components"
        LoadingSkeleton[LoadingSkeleton.vue]
        ErrorMessage[ErrorMessage.vue]
        EmptyState[EmptyState.vue]
    end

    App --> AppBar
    App --> NavDrawer
    App --> WordLearning
    App --> WordGallery

    AppBar --> ThemeToggle

    WordLearning --> InputForm
    WordLearning --> WordCard

    WordGallery --> WordCard

    InputForm --> InputValidation
    InputForm --> LoadingSkeleton
    InputForm --> ErrorMessage

    WordCard --> PhoneticDisplay
    WordCard --> DefinitionSection
    WordCard --> EtymologySection

    EtymologySection --> LoadingSkeleton
    EtymologySection --> ErrorMessage
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant WordStore
    participant DictService
    participant TransService
    participant AIService
    participant APIs
    participant LocalStorage

    User->>UI: Enter word "serendipity"
    UI->>WordStore: addWord("serendipity")

    WordStore->>DictService: fetchWord("serendipity")
    DictService->>APIs: GET /entries/en/serendipity
    APIs-->>DictService: {phonetic, meanings, audio}
    DictService-->>WordStore: Dictionary data

    WordStore->>TransService: translateToChinese(meanings)
    TransService->>APIs: POST /translate
    APIs-->>TransService: Chinese translations
    TransService-->>WordStore: Translation data

    WordStore->>LocalStorage: Save word
    WordStore-->>UI: Word added successfully
    UI-->>User: Display word card

    Note over WordStore,AIService: Async etymology generation
    WordStore->>AIService: generateEtymology("serendipity")
    AIService->>APIs: POST /chat/completions
    APIs-->>AIService: Etymology data
    AIService-->>WordStore: Update word with etymology
    WordStore->>LocalStorage: Update word
    WordStore-->>UI: Update word card
    UI-->>User: Show etymology section
```

## State Management

```mermaid
graph LR
    subgraph "Word Store"
        WordState[State: words, isLoading, error]
        WordGetters[Getters: wordCount, masteredWords]
        WordActions[Actions: addWord, deleteWord, updateWord]
    end

    subgraph "AI Store"
        AIState[State: cache, isGenerating, error]
        AIActions[Actions: generateEtymology, clearCache]
    end

    subgraph "UI Store"
        UIState[State: theme, isDrawerOpen]
        UIActions[Actions: toggleTheme, toggleDrawer]
    end

    Components --> WordGetters
    Components --> WordActions
    Components --> AIActions
    Components --> UIActions

    WordActions --> WordState
    AIActions --> AIState
    UIActions --> UIState
```

## Service Layer Architecture

```mermaid
graph TB
    subgraph "Dictionary Service"
        FetchWord[fetchWord]
        ParsePhonetic[parsePhonetic]
        ParseMeanings[parseMeanings]
        ErrorHandler1[handleError]
    end

    subgraph "Translation Service"
        TranslateCN[translateToChinese]
        CacheCheck1[checkCache]
        APICall1[callTranslationAPI]
        ErrorHandler2[handleError]
    end

    subgraph "AI Service"
        GenerateEtym[generateEtymology]
        BuildPrompt[buildPrompt]
        ParseResponse[parseResponse]
        CacheResult[cacheResult]
        ErrorHandler3[handleError]
    end

    subgraph "Audio Service"
        PlayAudio[playAudio]
        Speak[speak]
        CheckSupport[checkBrowserSupport]
        ErrorHandler4[handleError]
    end

    FetchWord --> ParsePhonetic
    FetchWord --> ParseMeanings
    FetchWord --> ErrorHandler1

    TranslateCN --> CacheCheck1
    CacheCheck1 --> APICall1
    APICall1 --> ErrorHandler2

    GenerateEtym --> BuildPrompt
    BuildPrompt --> ParseResponse
    ParseResponse --> CacheResult
    GenerateEtym --> ErrorHandler3

    PlayAudio --> CheckSupport
    Speak --> CheckSupport
    PlayAudio --> ErrorHandler4
```

## User Flow Diagrams

### Add Word Flow

```mermaid
flowchart TD
    Start([User opens app])
    Input[Enter word in input field]
    Validate{Valid word?}
    Submit[Click Add or press Enter]
    Loading[Show loading state]
    FetchDict[Fetch dictionary data]
    DictSuccess{Success?}
    FetchTrans[Fetch translation]
    TransSuccess{Success?}
    SaveWord[Save word to store]
    DisplayCard[Display word card]
    FetchEtym[Fetch etymology async]
    EtymSuccess{Success?}
    UpdateCard[Update card with etymology]
    End([Word added successfully])
    Error[Show error message]

    Start --> Input
    Input --> Validate
    Validate -->|No| Error
    Validate -->|Yes| Submit
    Submit --> Loading
    Loading --> FetchDict
    FetchDict --> DictSuccess
    DictSuccess -->|No| Error
    DictSuccess -->|Yes| FetchTrans
    FetchTrans --> TransSuccess
    TransSuccess -->|No| Error
    TransSuccess -->|Yes| SaveWord
    SaveWord --> DisplayCard
    DisplayCard --> FetchEtym
    FetchEtym --> EtymSuccess
    EtymSuccess -->|Yes| UpdateCard
    EtymSuccess -->|No| End
    UpdateCard --> End
    Error --> Input
```

### Audio Playback Flow

```mermaid
flowchart TD
    Start([User clicks phonetic])
    CheckAudio{Audio URL exists?}
    PlayURL[Play audio from URL]
    URLSuccess{Playback success?}
    CheckSpeech{Web Speech supported?}
    UseSpeech[Use Web Speech API]
    SpeechSuccess{Speech success?}
    ShowPlaying[Show playing animation]
    End([Audio played])
    Error[Show error message]

    Start --> CheckAudio
    CheckAudio -->|Yes| PlayURL
    CheckAudio -->|No| CheckSpeech
    PlayURL --> URLSuccess
    URLSuccess -->|Yes| ShowPlaying
    URLSuccess -->|No| CheckSpeech
    CheckSpeech -->|Yes| UseSpeech
    CheckSpeech -->|No| Error
    UseSpeech --> SpeechSuccess
    SpeechSuccess -->|Yes| ShowPlaying
    SpeechSuccess -->|No| Error
    ShowPlaying --> End
```

## Caching Strategy

```mermaid
graph TB
    subgraph "Cache Layers"
        Memory[In-Memory Cache]
        Local[localStorage]
        API[API Responses]
    end

    subgraph "Cache Policies"
        Dict[Dictionary: 24 hours]
        Trans[Translation: 7 days]
        Etym[Etymology: Permanent]
        Audio[Audio URLs: 24 hours]
    end

    Request[API Request]
    CheckMemory{In memory?}
    CheckLocal{In localStorage?}
    CallAPI[Call API]
    StoreMemory[Store in memory]
    StoreLocal[Store in localStorage]
    Return[Return data]

    Request --> CheckMemory
    CheckMemory -->|Yes| Return
    CheckMemory -->|No| CheckLocal
    CheckLocal -->|Yes| StoreMemory
    CheckLocal -->|No| CallAPI
    CallAPI --> StoreMemory
    StoreMemory --> StoreLocal
    StoreLocal --> Return

    Dict --> Memory
    Trans --> Memory
    Etym --> Local
    Audio --> Memory
```

## Error Handling Flow

```mermaid
flowchart TD
    Error[Error Occurs]
    Type{Error Type?}
    Network[Network Error]
    API[API Error]
    Validation[Validation Error]
    Storage[Storage Error]

    Retry{Retryable?}
    ShowRetry[Show retry button]
    ShowError[Show error message]
    Log[Log error]
    Fallback{Fallback available?}
    UseFallback[Use fallback]

    Error --> Type
    Type --> Network
    Type --> API
    Type --> Validation
    Type --> Storage

    Network --> Retry
    API --> Retry
    Validation --> ShowError
    Storage --> Fallback

    Retry -->|Yes| ShowRetry
    Retry -->|No| ShowError
    ShowRetry --> Log
    ShowError --> Log

    Fallback -->|Yes| UseFallback
    Fallback -->|No| ShowError
    UseFallback --> Log
```

## Performance Optimization

```mermaid
graph TB
    subgraph "Bundle Optimization"
        CodeSplit[Code Splitting]
        LazyLoad[Lazy Loading]
        TreeShake[Tree Shaking]
    end

    subgraph "Runtime Optimization"
        Caching[Aggressive Caching]
        Debounce[Debounce/Throttle]
        VirtualScroll[Virtual Scrolling]
    end

    subgraph "Asset Optimization"
        ImageOpt[Image Optimization]
        FontOpt[Font Optimization]
        IconOpt[Icon Optimization]
    end

    subgraph "Rendering Optimization"
        LazyComp[Lazy Components]
        KeepAlive[Keep-Alive]
        Memo[Memoization]
    end

    App[Application]

    App --> CodeSplit
    App --> LazyLoad
    App --> TreeShake
    App --> Caching
    App --> Debounce
    App --> VirtualScroll
    App --> ImageOpt
    App --> FontOpt
    App --> IconOpt
    App --> LazyComp
    App --> KeepAlive
    App --> Memo
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Dev[Local Development]
        DevServer[Vite Dev Server]
    end

    subgraph "Build"
        Build[npm run build]
        Optimize[Optimize Assets]
        Bundle[Create Bundle]
    end

    subgraph "Deployment"
        Vercel[Vercel]
        Netlify[Netlify]
        GHPages[GitHub Pages]
    end

    subgraph "CDN"
        Static[Static Assets]
        Cache[Edge Caching]
    end

    subgraph "Monitoring"
        Analytics[Analytics]
        Errors[Error Tracking]
        Performance[Performance Monitoring]
    end

    Dev --> DevServer
    DevServer --> Build
    Build --> Optimize
    Optimize --> Bundle
    Bundle --> Vercel
    Bundle --> Netlify
    Bundle --> GHPages

    Vercel --> Static
    Netlify --> Static
    GHPages --> Static

    Static --> Cache

    Vercel --> Analytics
    Vercel --> Errors
    Vercel --> Performance
```

## Security Architecture

```mermaid
graph TB
    subgraph "Input Security"
        Validation[Input Validation]
        Sanitization[XSS Sanitization]
        RateLimit[Rate Limiting]
    end

    subgraph "API Security"
        EnvVars[Environment Variables]
        KeyRotation[API Key Rotation]
        HTTPS[HTTPS Only]
    end

    subgraph "Storage Security"
        Encryption[Data Encryption]
        NoSensitive[No Sensitive Data]
        QuotaCheck[Quota Checking]
    end

    subgraph "Content Security"
        CSP[Content Security Policy]
        CORS[CORS Configuration]
        SRI[Subresource Integrity]
    end

    User[User Input]

    User --> Validation
    Validation --> Sanitization
    Sanitization --> RateLimit

    RateLimit --> EnvVars
    EnvVars --> KeyRotation
    KeyRotation --> HTTPS

    HTTPS --> Encryption
    Encryption --> NoSensitive
    NoSensitive --> QuotaCheck

    QuotaCheck --> CSP
    CSP --> CORS
    CORS --> SRI
```

## Testing Architecture

```mermaid
graph TB
    subgraph "Unit Tests"
        ServiceTests[Service Tests]
        StoreTests[Store Tests]
        UtilTests[Utility Tests]
    end

    subgraph "Component Tests"
        InputTests[Input Component Tests]
        DisplayTests[Display Component Tests]
        SharedTests[Shared Component Tests]
    end

    subgraph "Integration Tests"
        StoreIntegration[Store + Service Tests]
        ComponentIntegration[Component + Store Tests]
    end

    subgraph "E2E Tests"
        AddWordFlow[Add Word Flow]
        AudioFlow[Audio Playback Flow]
        SearchFlow[Search Flow]
    end

    subgraph "Quality Gates"
        Coverage[80% Coverage]
        Lint[ESLint Pass]
        TypeCheck[TypeScript Check]
        A11y[Accessibility Check]
    end

    ServiceTests --> Coverage
    StoreTests --> Coverage
    UtilTests --> Coverage
    InputTests --> Coverage
    DisplayTests --> Coverage
    SharedTests --> Coverage

    StoreIntegration --> Coverage
    ComponentIntegration --> Coverage

    AddWordFlow --> A11y
    AudioFlow --> A11y
    SearchFlow --> A11y

    Coverage --> Lint
    Lint --> TypeCheck
    TypeCheck --> A11y
```

## Technology Stack Overview

```mermaid
graph TB
    subgraph "Frontend Framework"
        Vue3[Vue 3]
        TS[TypeScript]
        Vite[Vite]
    end

    subgraph "UI Framework"
        Vuetify[Vuetify 3]
        Tailwind[TailwindCSS 4]
        Sass[Sass]
    end

    subgraph "State Management"
        Pinia[Pinia]
        Router[Vue Router 4]
    end

    subgraph "HTTP & APIs"
        Axios[Axios]
        OpenAISDK[OpenAI SDK]
    end

    subgraph "Utilities"
        UUID[UUID]
        DateFns[date-fns]
        Zod[Zod]
    end

    subgraph "Testing"
        Vitest[Vitest]
        Playwright[Playwright]
        TestingLib[Testing Library]
    end

    subgraph "Code Quality"
        ESLint[ESLint]
        Prettier[Prettier]
        TypeScriptC[TypeScript Compiler]
    end

    App[Big Big Word]

    App --> Vue3
    App --> TS
    App --> Vite
    App --> Vuetify
    App --> Tailwind
    App --> Sass
    App --> Pinia
    App --> Router
    App --> Axios
    App --> OpenAISDK
    App --> UUID
    App --> DateFns
    App --> Zod

    Vue3 --> Vitest
    Vue3 --> Playwright
    Vue3 --> TestingLib

    TS --> ESLint
    TS --> Prettier
    TS --> TypeScriptC
```

---

## Architecture Principles

### 1. Separation of Concerns

- **Presentation Layer**: Vue components (UI only)
- **Business Logic**: Pinia stores
- **Data Access**: Service layer
- **External APIs**: Isolated in services

### 2. Single Responsibility

- Each component has one clear purpose
- Each service handles one API
- Each store manages one domain

### 3. Dependency Injection

- Services are injected into stores
- Stores are injected into components
- Easy to mock for testing

### 4. Error Boundaries

- Errors caught at service layer
- Propagated to stores
- Displayed in UI components
- Logged for debugging

### 5. Performance First

- Lazy loading for routes
- Code splitting for heavy features
- Aggressive caching
- Optimized bundle size

### 6. Accessibility First

- ARIA labels everywhere
- Keyboard navigation
- Screen reader support
- Color contrast compliance

### 7. Mobile First

- Responsive design
- Touch-friendly targets
- Progressive enhancement
- Offline capability (future)

---

## Scalability Considerations

### Horizontal Scaling

- Stateless frontend (can deploy multiple instances)
- CDN for static assets
- API rate limiting per user

### Vertical Scaling

- Code splitting reduces initial load
- Lazy loading reduces memory usage
- Virtual scrolling for large lists

### Data Scaling

- IndexedDB for larger datasets (future)
- Pagination for word gallery
- Infinite scroll option

### Feature Scaling

- Plugin architecture for new features
- Feature flags for gradual rollout
- Modular component design

---

_This architecture is designed to be maintainable, scalable, and performant while providing an excellent user experience._
