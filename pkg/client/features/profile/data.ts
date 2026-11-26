import { faker } from "@faker-js/faker"

export interface ProfilePreview {
  name: string
  email: string
  username: string
  avatar: string
  bio: string
  followerCount: number
  followingCount: number
}

function createSeed(handle: string) {
  return [...handle].reduce(
    (seed, character) => (seed * 31 + character.charCodeAt(0)) >>> 0,
    0
  )
}

export function createProfilePreview(handle: string): ProfilePreview {
  const normalizedHandle = handle.replace(/^@/, "").toLowerCase()

  faker.seed(createSeed(normalizedHandle))

  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    name: faker.person.fullName({ firstName, lastName }),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    username: normalizedHandle,
    avatar: faker.image.avatar(),
    bio: faker.person.bio(),
    followerCount: faker.number.int({ min: 120, max: 250_000 }),
    followingCount: faker.number.int({ min: 40, max: 2_500 }),
  }
}
