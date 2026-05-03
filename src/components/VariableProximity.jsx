import { forwardRef, useRef, useEffect } from "react";







const VariableProximity = forwardRef(
  (
    {
      label,
      containerRef,
      radius = 100,
      className = "",
      style,
    },
    ref
  ) => {
    const letterRefs = useRef([]);

    useEffect(() => {
      const handleMove = (e) => {
        if (!containerRef?.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        letterRefs.current.forEach((letter) => {
          if (!letter) return;

          const r = letter.getBoundingClientRect();
          const x = r.left + r.width / 2 - rect.left;
          const y = r.top + r.height / 2 - rect.top;

          const distance = Math.sqrt(
            (mouseX - x) ** 2 + (mouseY - y) ** 2
          );

          const scale = Math.max(1, 1.5 - distance / radius);

          letter.style.transform = `scale(${scale})`;
        });
      };

      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    }, [containerRef, radius]);

    return (
      <span
        ref={ref}
        className={className}
        style={{ display: "inline-block", ...style }}
      >
        {label.split("").map((letter, i) => (
          <span
            key={i}
            ref={(el) => (letterRefs.current[i] = el)}
            style={{
              display: "inline-block",
              transition: "transform 0.2s ease",
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    );
  }
);

export default VariableProximity;