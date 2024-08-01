import { Badge, Box } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction, isAdmin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme={isAdmin ? "blue" : "gray"}
      cursor={isAdmin ? "pointer" : "default"}
      onClick={isAdmin ? handleFunction : undefined}
      bg={isAdmin ? "blue.500" : "gray.200"}
      color={isAdmin ? "white" : "gray.500"}
    >
      {user.username}
      {isAdmin && (
        <Box as="span" ml={1} fontSize="xs" color="yellow.300">
          Admin
        </Box>
      )}
    </Badge>
  );
};

export default UserBadgeItem;
