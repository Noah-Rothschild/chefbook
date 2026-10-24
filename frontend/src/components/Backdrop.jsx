// Decorative food doodles pinned to the page margins, behind all content.
function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <img src="/backdrop/pizza.png" alt="" className="backdrop-pizza" />
      <img src="/backdrop/icecream.png" alt="" className="backdrop-icecream" />
      <img src="/backdrop/noodles.png" alt="" className="backdrop-noodles" />
    </div>
  );
}

export default Backdrop;
