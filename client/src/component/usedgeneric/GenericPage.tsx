import CenteredLayout from "../generic/CenteredLayout";
import GridLayout from "../generic/GridLayout";
import HeaderFooterLayout from "../generic/HeaderFooterLayout";
import SidebarLayout from "../generic/SidebarLayout";

export default function GenericPage() {
  return (
    <div>
      {/* Section 1: Centered Welcome */}
      <section style={{ marginBottom: "40px" }}>
        <CenteredLayout>
          <h1>Welcome to the Cosmos</h1>
        </CenteredLayout>
      </section>

      {/* Section 2: Sidebar Navigation */}
      <section style={{ marginBottom: "40px" }}>
        <SidebarLayout
          sidebar={
            <nav>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </nav>
          }
        >
          <p>Main content goes here! Navigate through the mysteries of the cosmos.</p>
        </SidebarLayout>
      </section>

      {/* Section 3: Header and Footer */}
      <section style={{ marginBottom: "40px" }}>
        <HeaderFooterLayout
          header={<h1>Starry Navigation</h1>}
          footer={<p>&copy; 2024 Astrology Blog</p>}
        >
          <p>Explore the mysteries of the universe.</p>
        </HeaderFooterLayout>
      </section>

      {/* Section 4: Grid Layout */}
      <section style={{ padding: "20px" }}>
        <GridLayout columns={4} gap="20px">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ padding: "10px", background: "#2d2d4b", borderRadius: "8px" }}>
              Card {i + 1}
            </div>
          ))}
        </GridLayout>
      </section>
    </div>
  );
}
