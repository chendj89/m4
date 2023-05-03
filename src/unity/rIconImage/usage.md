### sfc 模式
```html
<!-- 可以接受NIcon、NImage的属性 -->
<rIconImage src="../*.png"></rIconImage>
```

### tsx 模式
```ts
render(){
  return <>
    {
      default:()=>rIconImage({src:'../*.png'})
    }
  <>
}
```
