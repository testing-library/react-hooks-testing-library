---
name: FAQ
menu: Reference
route: '/reference/faq'
---

# Frequently Asked Questions

- [Why I need to use `result.current` instead of just `result`?](/reference/faq#why-i-need-to-use-resultcurrent-instead-of-just-result)

---

### Why I need to use `result.current` instead of just `result`?

The "ref-like" representation of the hook's result allows the value to be updated when the hook gets rerendered, whether that be from calling `rerender`, calling a callback returned from the hook, or an asynchronous action triggered by executing the hook. Without `current` the library would have to provide some way of requesting the updated values for assertions.
