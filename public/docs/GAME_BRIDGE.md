# MOYA Game Bridge — Integration Guide

How to connect your Unity / Godot / Construct / custom web game to MOYA points system.

---

## Overview

When your game is embedded as an iframe inside MOYA, it communicates with the
parent page through the browser's `window.postMessage` API.

---

## Sending Messages FROM Your Game TO MOYA

Use these from your game's JavaScript (or from C# via Unity's `Application.ExternalCall`,
or from GDScript via `JavaScriptBridge`):

```javascript
// Report a score (adds points to player's wallet)
window.parent.postMessage({ type: 'AQUAWATCH_SCORE', points: 42 }, '*')

// Report game over with final score
window.parent.postMessage({ type: 'AQUAWATCH_GAMEOVER', points: 150 }, '*')

// Ask MOYA to send you the player's current point balance
window.parent.postMessage({ type: 'AQUAWATCH_REQUEST_POINTS' }, '*')

// Tell MOYA the player wants to exit back to the hub
window.parent.postMessage({ type: 'AQUAWATCH_EXIT' }, '*')
```

---

## Receiving Messages FROM MOYA IN Your Game

Listen for messages sent back:

```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'AQUAWATCH_POINTS') {
    const playerPoints = event.data.points
    // Show in your game's HUD, or use to gate premium features
  }
})
```

---

## Unity C# Example

```csharp
using UnityEngine;

public class AquaWatchBridge : MonoBehaviour
{
    // Call this when the player scores
    public void ReportScore(int points)
    {
        Application.ExternalCall("aquaWatchScore", points);
    }

    // Add to your HTML template's <script> tag:
    // function aquaWatchScore(pts) {
    //   window.parent.postMessage({ type: 'AQUAWATCH_SCORE', points: pts }, '*');
    // }
}
```

Or more directly in Unity WebGL:
```csharp
[DllImport("__Internal")]
private static extern void PostMessageToParent(string type, int points);
```

With a corresponding jslib plugin file:
```javascript
// Assets/Plugins/WebGL/AquaWatchBridge.jslib
mergeInto(LibraryManager.library, {
  PostMessageToParent: function(typePtr, points) {
    var type = UTF8ToString(typePtr);
    window.parent.postMessage({ type: type, points: points }, '*');
  }
});
```

---

## Godot GDScript Example

```gdscript
# Call this when you want to report a score
func report_score(points: int):
    JavaScriptBridge.eval(
        "window.parent.postMessage({ type: 'AQUAWATCH_SCORE', points: %d }, '*')" % points
    )

# Call this to get the player's current points
func request_player_points():
    JavaScriptBridge.eval(
        "window.parent.postMessage({ type: 'AQUAWATCH_REQUEST_POINTS' }, '*')"
    )

# Listen for replies (set up in _ready)
func _ready():
    if OS.get_name() == "Web":
        JavaScriptBridge.connect("message_received", _on_message)

func _on_message(message):
    var data = JSON.parse_string(message)
    if data and data.get("type") == "AQUAWATCH_POINTS":
        var player_points = data["points"]
        # Update your HUD
```

---

## Construct 3 Example

In an Event Sheet, use the **Browser** object:
- Action: **Browser > Execute JavaScript**:
```javascript
window.parent.postMessage({ type: 'AQUAWATCH_SCORE', points: Score }, '*');
```

---

## File Structure

Put exported game files here:
```
public/
  games/
    your-game-id/
      index.html       ← game entry point
      Build/           ← Unity build output
      TemplateData/    ← Unity template
      ...etc
```

Then in `gameRegistry.js`:
```javascript
{
  id: 'your-game-id',
  type: 'iframe',
  iframeSrc: '/games/your-game-id/index.html',
  engine: 'unity',  // or 'godot', 'construct', 'custom'
  ...
}
```

---

## Score Design Recommendations

- Award points for **meaningful achievements**, not just time played
- Use small increments (5–50 pts per session) to keep the economy balanced
- Report scores at natural milestones (level complete, game over)
- Don't report scores more than once per session to prevent farming
