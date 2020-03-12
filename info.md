**Sample overview:**

![Sample overview](https://github.com/marrobHD/firetv-card/blob/master/8Gq031OUIo.png)

Add this to your lovelace configuration:

```yaml
type: 'custom:firetv-card'
theme: Backend-selected
tv: false
entity: media_player.spotify
name: FireTV
power:
  service: androidtv.adb_command
  service_data:
    command: "input keyevent 26"
    entity_id: media_player.firetv
```

Look at [README](https://github.com/marrobHD/firetv-card/blob/master/README.md) for more information
