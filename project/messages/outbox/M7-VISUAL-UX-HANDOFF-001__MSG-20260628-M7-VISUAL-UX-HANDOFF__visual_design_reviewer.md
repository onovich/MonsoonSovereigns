# M7-VISUAL-UX-HANDOFF-001.md

## 0. Source Limitations

已读取当前 `PROJECT_STATUS.md`、UI/UX、美术/本地化文档、M7 task 文件、当前 `client-core` / `ui` / `map-renderer` 线索。UI 原画判断基于本线程已检视的 `sample1`-`sample3`，以 `sample3` 为主要视觉参考。

## 1. Design Intent

UI 应让玩家感觉自己在经营一个受季风、贡赋、任命、补给和承认关系牵动的宫廷/宗主网络：玩家通过可解释的 `GameCommand` 做决定，胜利来自战后治理与长期稳定，而不是地图涂色。

## 2. Screen-Level Information Hierarchy

| Area | Player Question Answered | Current Mapping | Required Visible Data | Hidden Debug Data | Actions | Localization Risk | Asset Slots |
|---|---|---|---|---|---|---|---|
| Top bar | 现在是什么局势，资源能否行动？ | `panels.metrics`, M5/M6/M7 read models; design requires date/season/resources | date/season, speed, money, grain, labor, admin/political capacity, alerts | revision, hash, internal fixture names | pause/speed, open alerts/settings | date/season labels, long resource labels | top frame, resource icons, alert badge |
| Central map | 哪里重要，路线/季风/控制如何？ | Pixi map from district/settlement/route read models; modes seasonal/economy/routes | district, settlement, route, selected, reachable/blocked, legend | map revision, prototype labels | select, zoom/pan, mode switch | map labels, layer names | terrain fills, route styles, settlement icons |
| Left/court panel | 我是谁，宫廷风险是什么？ | M3 polity/character/succession read models; currently prototype UI | court, ruler, legitimacy/stability, succession, vassals, key alerts | polity ids, raw reason codes | open court, inspect succession/obligations | titles/names may expand; cultural review | portrait, court frame, succession icons |
| Right inspector | 选中对象能做什么？代价是什么？ | district row, M3 admin preview, M4 plan/route/supply projections | population, grain, labor, route, governance, recommended action, reasons, costs | test ids, raw enum names | preview/confirm action, jump to related object | reason translations, compact metrics | inspector frame, action buttons, tooltip |
| Bottom panels | 当前待处理事务是什么？ | M3 obligations/appointment/succession; M4 campaign; M5 playable steps; M7 guidance | obligations, candidates, crisis, campaign prep, war report | M2/M3/M4 labels, raw command ids | appoint, review plan, manage crisis, view all | tab labels and card density | drawer frame, tab badges, card icons |
| Notifications/proposals | 什么需要我现在处理？ | Designed; M7 guidance/hints exist; full player proposal surface partly target | severity, source, due time, linked object, reason | dev timings, raw reason summary | open, dismiss, jump | severity words, time strings | alert icons, notification row |
| Settings/language | 如何切换语言/显示？ | M7 audio/art/localization coverage exists; full language control target | system/en-US/zh-CN, display scale if added, dev toggle hidden | locale test labels | choose language, persist | all player text must use i18n | settings/language icon, menu frame |
| Dev overlay | 开发者如何验证？ | Current UI exposes revision/hash/reason codes; should move here | revision, hash, fixture, raw reason code, timings | n/a | toggle, copy debug state | not player localized except labels | distinct debug panel |

## 3. Mapping From Concept Art To Current Systems

| Concept Art Element | Current Code/Design Mapping | Status | 1.0 Decision |
|---|---|---|---|
| Top seasonal/resource bar | Design requires date/season/speed/resources; current shell has metrics, M5/M7 coverage | implemented but prototype UI | Must ship as player top bar; keep admin/political capacity visible |
| Map | Pixi map renders districts, settlements, routes from read model; map modes exist | implemented but prototype UI | Must remain central; visual upgrade without authority shift |
| District inspector | District list/panel plus M3/M4 previews | implemented but prototype UI | Must become player-facing right inspector |
| Court/ruler/succession | M3 characters, polities, succession crises | implemented but prototype UI | Must surface as court panel, culturally reviewed |
| Tribute obligations | M3 obligation read model: tribute/troop/garrison, status, reason codes | implemented but prototype UI | Must show pending/breached obligations clearly |
| Appointment candidates | M3 office/candidate eligibility, rejected reasons, bulk preview | implemented but prototype UI | Must become a guided appointment flow |
| Campaign preparation | M4 campaign plan, muster, grain, route, march, siege, withdrawal, AI, reports | implemented but prototype UI | Must show prep, supply, route risk, no manual battle |
| Notification/proposal area | UI spec designs notification classes; M7 hints/adviser evidence exists | designed but not surfaced | Build minimal notification/proposal panel if scoped |
| Settings/language | M7 localization coverage exists; player switcher still needs product shell | designed but not surfaced | Must support system/en-US/zh-CN before Beta exit |
| Debug diagnostics | Current UI exposes revision/hash/prototype labels/reason codes | implemented but prototype UI | Move behind dev overlay |
| Manual node battle UI | Manual node battle explicitly deferred | rejected for 1.0 | Not in 1.0 mainline unless later Human Gate changes |

## 4. Recommended Player Flow

1. Enter game: show top bar, map, current objective, hidden dev overlay.  
   Current mapping: M5/M6/M7 goal/read-model evidence. Client work: layout and i18n; no new sim.

2. Identify situation: player reads season, resources, alerts, selected scenario/court.  
   Current mapping: metrics, M7 guidance, M3/M4 summaries. Client work: translate and group.

3. Select district: click map or list; map/list/inspector sync.  
   Current mapping: `ClientMapEntitySelection`, district rows, Pixi selection. Client work: visual selection states.

4. Inspect resources/routes/governance: show population, grain, labor, route status, admin burden, reasons.  
   Current mapping: district, M3 admin preview, M4 route/supply. Client work: player labels and reason-code translation.

5. Appoint or govern: choose office/candidate, see eligible/rejected reasons and impact, confirm command.  
   Current mapping: `createM3AppointmentCommand`, bulk appointment. Client work: flow polish, not new rules.

6. Review obligations/succession: show breached tribute, pending crisis, support reasons.  
   Current mapping: M3 obligations and succession crises. Client work: compact cards and warning states.

7. Preview campaign or advance time: review target, muster, supply days, route bottleneck, monsoon risk, siege/withdraw options.  
   Current mapping: M4 command factories and M5 playable steps. Client work: command preview layout.

8. Receive feedback: notification/war report/postwar consequences explain result and next action.  
   Current mapping: M4 war reports, M5 postwar/risk/reason summaries, M7 hints. Client work: notification surface and copy.

## 5. Visual Direction

- Overall tone: sober court map-room, archival but operational.
- Palette: ink black, rice paper, river teal, oxidized copper, muted grain green, lacquer red only for danger.
- Map categories: base terrain neutral, river/monsoon teal, friendly influence soft green, vassal/tribute route copper, enemy threat red hatch, blocked route desaturated red/gray.
- Panels: parchment content on dark structural frame; restrained borders, no heavy fantasy ornament.
- Hierarchy: map first, top state second, selected inspector/action third, bottom drawer fourth.
- Typography: system font stack; optional serif-like treatment only for large titles if licensed/available; numbers tabular via CSS.
- Icons: simple line icons, cultural-symbol-safe; no sacred/religious symbols as generic buttons.
- States: eligible green/teal, rejected muted red, warning amber/copper, success green, disabled low-contrast with pattern/icon, danger red with text.
- Dev mode: visibly technical monochrome overlay, never styled like player parchment UI.

## 6. Design Tokens

| Token Group | Semantics / Use |
|---|---|
| colors.surface.ink | app shell background, top bar, drawer frame |
| colors.surface.paper | inspector/card content areas |
| colors.text.primary/secondary/muted | DOM text hierarchy |
| colors.accent.river | river, selection, primary action |
| colors.accent.copper | tribute, border, secondary accent |
| colors.semantic.danger/warning/success/info | alerts, command results |
| colors.map.control/vassal/enemy/monsoon/blocked | map layer fills and hatches |
| spacing.1-8 | compact strategy UI rhythm; dense but readable |
| typography.title/body/label/number | title, body, uppercase label, tabular values |
| radius.panel/card/button | low radius, <= 8px unless component requires |
| border.hairline/strong/focus | frames, separators, keyboard focus |
| elevation.overlay/popover/drawer | tooltip, menu, bottom drawer |
| route.reachable/blocked/overloaded/tribute/supply/march | route stroke style semantics |
| obligation.pending/breached/fulfilled/partial | obligation card state |
| appointment.eligible/rejected/current/vacant | candidate and office state |
| campaign.ready/risky/blocked/complete/withdraw | campaign plan status |

## 7. Asset Replacement Slots

| Slot | Sizing | Vector Preferred | Fallback | Localization Impact | Role |
|---|---|---|---|---|---|
| Top bar frame | horizontal flexible | yes | CSS border/background | none | cosmetic |
| Panel frame | 9-slice/flexible | yes/CSS | dark frame + border | text area must flex | cosmetic |
| Map terrain fills | tile/fill patterns | no/bitmap ok | flat fills | none | functional readability |
| Settlement icons | 16-32px scalable | yes | geometric marker | labels nearby | functional |
| Route line styles | stroke/pattern | yes/CSS/Pixi | solid/dashed lines | legend labels | functional |
| District selection glow | scalable stroke | yes | outline stroke | none | functional |
| Resource icons | 16-24px | yes | lucide/simple icons | labels required | functional |
| Obligation icons | 16-24px | yes | generic ledger icon | labels required | functional |
| Succession icons | 16-24px | yes | node/crown-neutral icon | culturally sensitive | functional |
| Appointment icons | 16-24px | yes | office/person icon | labels required | functional |
| Campaign icons | 16-24px | yes | route/shield icons | labels required | functional |
| Alert icons | 16-24px | yes | severity glyphs | severity text needed | functional |
| Portrait placeholders | fixed aspect 1:1 or 4:5 | no | silhouette/initials | names/titles vary | cosmetic until reviewed |
| Buttons | flexible | CSS first | tokenized button | long labels | functional |
| Tooltip frames | flexible | CSS | plain popover | text expansion high | functional |
| Scrollbars | system/CSS | n/a | native scrollbar | none | functional |
| Language/settings icon | 20-24px | yes | gear/globe | menu labels vary | functional |

## 8. Localization Implications

All player-visible text must pass through i18n. `sim-core` should emit stable reason codes and context only; UI translates.

- Supported: `system`, `en-US`, `zh-CN`.
- English reason strings are often longer; Chinese labels may be shorter but denser.
- Buttons need min-width plus wrapping: `Confirm Action`, `Review Plan`, `任命`, `查看风险`.
- Tooltips need max-width and line wrapping; no bitmap text.
- Table columns need hide/reflow rules for Chinese and English.
- Dates/seasons need localized wrapper; do not invent a final historical calendar here.
- Numbers use `Intl.NumberFormat`.
- Font fallback: system UI stack plus CJK-capable fallback; no bundled CJK font without license/size review.
- Map labels and DOM labels should be separate; map label density may differ by locale.
- Language switching must not alter simulation state hash.

## 9. Debug Vs Player Mode Separation

Player mode must hide:

- `Revision`
- `stateHash`
- `prototype map ready`
- `Prototype District 001`
- raw reason codes
- internal ids / command ids
- `M2`, `M3`, `M4`, `M5`, `M7` labels in headings
- dev timings
- test-only labels and fixture names

Debug overlay should remain available only in development or explicit debug mode. It may show revision/hash/raw reason code/fixture/timings, use a visually distinct technical style, and expose copyable diagnostics without changing command state.

## 10. Implementation Guidance For Client Engineer

- Keep React state to UI/session/read-model state; never store full authoritative `WorldState`.
- Pixi is render cache only; rebuild from map read model.
- Translate reason codes in UI layer with context; retain raw code only in dev overlay/tooltips.
- Centralize tokens and asset registry; do not scatter hard-coded colors/assets.
- Add Storybook states for normal, empty, error, extreme, narrow, Chinese, English, debug-on/off.
- Add Playwright path: language switch, select district, inspect route/resources, appoint preview, campaign preview, no debug text in player mode.
- No hard-coded player-visible strings in components.
- Preserve keyboard focus, screen-reader labels, color+icon+text state communication.
- Responsive baseline: 1280x720, 1280x800, 1920x1080, ultrawide, 4K scaling.
- Use existing read models and command factories; do not duplicate sim formulas.

## 11. Risks And Non-Goals

Non-goals:

- No manual node battle for 1.0 mainline.
- No core simulation rewrite.
- No final full art production.
- No full new tutorial/encyclopedia beyond accepted M7 scopes.
- No large unapproved dependency.
- No server, multiplayer, telemetry, cloud-save implementation, account system, paid service, or secrets.
- Do not treat every concept-art element as mandatory 1.0 scope.

Risks:

- Visual polish may hide required reason/cost data.
- Raw reason-code translation may drift from sim semantics.
- Portrait/symbol choices may trigger cultural review.
- English/Chinese layout may break dense panels.
- Current M7 guidance/localization coverage can be mistaken for final app-shell i18n; keep scopes separate.

## 12. Handoff Summary

Must-do for M7:

- Player-mode shell hides debug/prototype labels.
- Top/map/inspector/drawer hierarchy implemented with tokens.
- English/Chinese/system language path.
- Reason-code translation layer for visible reasons.
- Storybook and Playwright coverage for core player flow.
- Asset slots and placeholders documented/centralized.

Should-do if time:

- Polished notification/proposal panel.
- Court panel portrait placeholders.
- Better map legend and route visual grammar.
- Compact bottom drawer behavior.

Defer to post-1.0:

- Manual node battle UI.
- Fully bespoke cultural asset sets.
- Advanced animated map art.
- Deep customizable HUD.

Requires Human Decision:

- Reversing manual node battle deferral.
- Major cultural-risk symbols or formal historical presentation.
- Branding/logo/trademark.
- Paid services, telemetry, accounts, cloud save implementation.

Requires real art assets later:

- Portraits, settlement icons, route/terrain treatments, panel frames, culturally reviewed symbols, audio cues.

Safe placeholder path:

- Tokenized CSS + vector placeholders + localized labels + dev overlay, all driven by existing read models.

```js
{
  task_id: "M7-VISUAL-UX-HANDOFF-001",
  status: "handoff_provided",
  source_limitations: "Repository docs/task/code were readable; concept-art basis is prior inspected sample1-sample3 in this thread.",
  must_preserve: ["DEFER_MANUAL_NODE_BATTLE", "read-model UI boundary", "Pixi render-cache only", "sim-core no i18n"],
  recommended_next_reviews: ["systems_architect", "client_engineer", "qa_reviewer"],
  implementation_tracks: ["player-mode shell", "i18n", "design tokens", "asset slots", "debug overlay separation", "core UI Playwright path"]
}
```

ROUTE_TO = lead_orchestrator

requested_action = systems_architect + client_engineer + qa_reviewer review and convert into M7 UI/localization tasks.
