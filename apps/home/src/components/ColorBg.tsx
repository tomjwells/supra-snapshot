import "~/styles/colorbg.css"

export default function ColorBg() {
  return (
    <div
      className={"colorbg absolute left-0 right-0 top-0 -z-50  overflow-visible"}
      style={{
        height: "100%",
        maxHeight: "1200px",
      }}
    ></div>
  )
}
