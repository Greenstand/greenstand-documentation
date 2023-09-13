# CSS and MaterialUI Guideline

* When you implement a UI (components, pages), please strictly follow the UI design in Figma, in terms of spacing, font-size, font-weight, line-height, ... ... every element should be the same as the Figma design as possible. Only by doing this, we can get a beautiful app, all those spacing, size set by the designer matters for a good UI.

&#x20;     Can you tell the difference between pictures below?&#x20;

![](<.gitbook/assets/image (2).png>)![](<.gitbook/assets/image (3).png>)

* Please use `spacing` function in theme to set the `px` when you can rather than raw `px` value instead. Static size values like '32px' should be avoided.
* For one-off CSS style, `sx` is a better choice, [https://mui.com/system/the-sx-prop/](https://mui.com/system/the-sx-prop/)
* For mobile development, please choose the device: `iPhone12 pro`, because that's the device we used in Figma.
* Sometimes it is uncomfortable when we just have `view` permission to check the elements on Figma, for example, for mixed text (a paragraph with multiple text styles), it's hard to check which style is which element. To solve this problem, you can copy the UI to your own workspace, then you got the edit permission on it. Check picture below:



![](<.gitbook/assets/Screen Shot 2022-01-22 at 3.02.04 PM.png>)

Some example:

```
        <Typography
          variant="h1"
          sx={{
            fontSize: [32, 48],
            fontWeight: [600, 700],
            lineHeight: (t) => [t.spacing(11.2), t.spacing(16.8)],
            letterSpacing: 0,
          }}
        >
          Come explore the global reforestation effort.
        </Typography>
```
