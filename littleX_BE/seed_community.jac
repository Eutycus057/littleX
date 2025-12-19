
import from littleX { create_community }

walker seed {
    can setup with `root entry {
        root |> create_community(name="Tech Enthusiasts", description="A place for tech lovers to discuss the latest trends.");
        print("Community 'Tech Enthusiasts' seeded successfully.");
    }
}
