export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function getInitiales(name: string) {
  let initiales = '';
  if (name.split(' ').length > 1) {
    initiales = `${name.split(' ')[0][0]} ${name.split(' ')[1][0]}`;
  } else initiales = name[0];
  return initiales;
}

export function stringAvatar(initiales: string) {
  return {
    sx: {
      bgcolor: stringToColor(initiales),
    },
    children: initiales,
  };
}
