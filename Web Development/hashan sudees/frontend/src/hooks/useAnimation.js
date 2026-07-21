import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { prefersReducedMotion } from '../lib/animations';

export function useScrollSpy(sectionIds, offset = 100) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
          setActiveId(sectionIds[i]);
          break;
        }
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}

export function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px', ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

export function useInViewOnce(ref, options = {}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: '50px', ...options });

  if (isInView && !hasAnimated) {
    setHasAnimated(true);
  }

  return isInView;
}

export function useParallax(speed = 0.5) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      if (scrolled + viewportHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = (scrolled - elementTop + viewportHeight) * speed;
        ref.current.style.transform = `translateY(${yPos}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}

export function useHover(ref) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);
    node.addEventListener('mouseenter', handleEnter);
    node.addEventListener('mouseleave', handleLeave);
    return () => {
      node.removeEventListener('mouseenter', handleEnter);
      node.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref]);

  return isHovered;
}

export function useFocusWithin(ref) {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const handleFocusIn = () => setIsFocused(true);
    const handleFocusOut = () => setIsFocused(false);
    node.addEventListener('focusin', handleFocusIn);
    node.addEventListener('focusout', handleFocusOut);
    return () => {
      node.removeEventListener('focusin', handleFocusIn);
      node.removeEventListener('focusout', handleFocusOut);
    };
  }, [ref]);

  return isFocused;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLarge = useMediaQuery('(min-width: 1280px)');

  return { isMobile, isTablet, isDesktop, isLarge };
}

export function useCountUp(end, duration = 2000, start = 0, isActive = true) {
  const [count, setCount] = useState(start);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!isActive || prefersReducedMotion()) {
      setCount(end);
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (end - start) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, start, isActive]);

  return count;
}

export function useCountUpInView(end, duration = 2000) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(end, duration, 0, isInView);
  return { ref, count };
}

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export function useThrottle(value, limit) {
  const [throttled, setThrottled] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottled(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));
    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttled;
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export function useSessionStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrl = false, shift = false, alt = false, meta = false, preventDefault = true } = options;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (ctrl && !e.ctrlKey) return;
      if (shift && !e.shiftKey) return;
      if (alt && !e.altKey) return;
      if (meta && !e.metaKey) return;
      if (preventDefault) e.preventDefault();
      callback(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrl, shift, alt, meta, callback, preventDefault]);
}

export function useIdle(timeout = 300000) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    setIsIdle(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsIdle(true), timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reset]);

  return isIdle;
}

export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = useCallback(() => setState(s => !s), []);
  return [state, toggle, setState];
}

export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let mounted = true;
    setState({ data: null, error: null, loading: true });
    asyncFn()
      .then(data => { if (mounted) setState({ data, error: null, loading: false }); })
      .catch(error => { if (mounted) setState({ data: null, error, loading: false }); });
    return () => { mounted = false; };
  }, deps);

  return state;
}

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const validate = useCallback((validationSchema) => {
    const newErrors = {};
    Object.keys(validationSchema).forEach(key => {
      const error = validationSchema[key](values[key], values);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values, errors, touched,
    handleChange, handleBlur,
    setFieldValue, setFieldError,
    validate, reset, setValues,
  };
}